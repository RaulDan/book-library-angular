const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const PORT = 7002;
const DATA_FILE_PATH = path.join(__dirname, 'mock-data', 'books.json');
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { ...JSON_HEADERS, ...CORS_HEADERS });
  res.end(JSON.stringify(payload));
}

function loadDefaultBooks() {
  try {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Books mock file must contain an array.');
    }

    return parsed.map((item) => ({
      id: Number(item.id),
      title: typeof item.title === 'string' ? item.title : '',
      author: typeof item.author === 'string' ? item.author : '',
      description: typeof item.description === 'string' ? item.description : '',
      category: typeof item.category === 'string' ? item.category : '',
      isFavorite: Boolean(item.isFavorite),
    }));
  } catch (error) {
    console.error(`Failed to load book mock data from ${DATA_FILE_PATH}:`, error.message);
    return [];
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });

    req.on('error', () => reject(new Error('Could not read request body.')));
  });
}

function normalizeDraft(payload, { requireAll }) {
  const draft = {};

  if (Object.prototype.hasOwnProperty.call(payload, 'title')) {
    draft.title = typeof payload.title === 'string' ? payload.title.trim() : '';
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'author')) {
    draft.author = typeof payload.author === 'string' ? payload.author.trim() : '';
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'description')) {
    draft.description = typeof payload.description === 'string' ? payload.description.trim() : '';
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'category')) {
    draft.category = typeof payload.category === 'string' ? payload.category.trim() : '';
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'isFavorite')) {
    draft.isFavorite = Boolean(payload.isFavorite);
  }

  if (
    requireAll &&
    (!draft.title || !draft.author || !draft.description || !draft.category)
  ) {
    return {
      error:
        'The "title", "author", "description" and "category" fields are required.',
    };
  }

  const requiredFields = ['title', 'author', 'description', 'category'];
  for (const field of requiredFields) {
    if (Object.prototype.hasOwnProperty.call(draft, field) && !draft[field]) {
      return { error: `The "${field}" field cannot be empty.` };
    }
  }

  return { data: draft };
}

let books = loadDefaultBooks();
let nextId = books.reduce((max, book) => Math.max(max, Number(book.id) || 0), 0) + 1;

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) {
    sendJson(res, 400, { error: 'Invalid request.' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = requestUrl.pathname;

  if (req.method === 'GET' && pathname === '/books') {
    sendJson(res, 200, books);
    return;
  }

  if (req.method === 'GET' && pathname === '/favorites') {
    sendJson(
      res,
      200,
      books.filter((book) => book.isFavorite)
    );
    return;
  }

  if (req.method === 'GET' && pathname === '/categories') {
    const categories = [...new Set(books.map((book) => book.category))].map((name) => ({
      name,
      books: books.filter((book) => book.category === name),
    }));
    sendJson(res, 200, categories);
    return;
  }

  if (req.method === 'POST' && pathname === '/books') {
    try {
      const payload = await readBody(req);
      const normalized = normalizeDraft(payload, { requireAll: true });
      if (normalized.error) {
        sendJson(res, 400, { error: normalized.error });
        return;
      }

      const newBook = {
        id: nextId++,
        title: normalized.data.title,
        author: normalized.data.author,
        description: normalized.data.description,
        category: normalized.data.category,
        isFavorite: Boolean(normalized.data.isFavorite),
      };

      books = [newBook, ...books];
      sendJson(res, 201, newBook);
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  const categoryMatch = pathname.match(/^\/categories\/([^/]+)\/books$/);
  if (req.method === 'GET' && categoryMatch) {
    const categoryName = decodeURIComponent(categoryMatch[1]);
    sendJson(
      res,
      200,
      books.filter((book) => book.category.toLowerCase() === categoryName.toLowerCase())
    );
    return;
  }

  const bookMatch = pathname.match(/^\/books\/([^/]+)$/);
  if (bookMatch) {
    const id = Number(bookMatch[1]);
    if (!Number.isFinite(id)) {
      sendJson(res, 400, { error: 'Invalid book id.' });
      return;
    }

    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      sendJson(res, 404, { error: `Book with id ${id} was not found.` });
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, books[index]);
      return;
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      try {
        const payload = await readBody(req);
        const normalized = normalizeDraft(payload, { requireAll: false });
        if (normalized.error) {
          sendJson(res, 400, { error: normalized.error });
          return;
        }

        const updated = { ...books[index], ...normalized.data };
        books[index] = updated;
        sendJson(res, 200, updated);
        return;
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'DELETE') {
      const [removed] = books.splice(index, 1);
      sendJson(res, 200, removed);
      return;
    }
  }

  const favoriteMatch = pathname.match(/^\/books\/([^/]+)\/favorite$/);
  if (favoriteMatch && req.method === 'POST') {
    const id = Number(favoriteMatch[1]);
    if (!Number.isFinite(id)) {
      sendJson(res, 400, { error: 'Invalid book id.' });
      return;
    }

    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      sendJson(res, 404, { error: `Book with id ${id} was not found.` });
      return;
    }

    try {
      const payload = await readBody(req);
      const hasRequestedValue = Object.prototype.hasOwnProperty.call(payload, 'isFavorite');
      const nextFavoriteValue = hasRequestedValue
        ? Boolean(payload.isFavorite)
        : !books[index].isFavorite;
      books[index] = { ...books[index], isFavorite: nextFavoriteValue };
      sendJson(res, 200, books[index]);
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  sendJson(res, 404, { error: 'Route not found.' });
});

server.listen(PORT, () => {
  console.log(`Angular mock backend running at http://localhost:${PORT}`);
});