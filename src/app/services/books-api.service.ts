import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Book, BookDraft } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private readonly apiBaseUrl = 'http://localhost:7002';
  private hasLoaded = false;

  readonly books = signal<Book[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly categories = computed(() =>
    [...new Set(this.books().map((book) => book.category))].sort((a, b) => a.localeCompare(b))
  );
  readonly favoriteBooks = computed(() => this.books().filter((book) => book.isFavorite));

  constructor(private readonly http: HttpClient) {}

  async ensureLoaded(): Promise<void> {
    if (this.hasLoaded) {
      return;
    }
    await this.fetchBooks();
  }

  async fetchBooks(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const books = await firstValueFrom(this.http.get<Book[]>(`${this.apiBaseUrl}/books`));
      this.books.set(books);
      this.hasLoaded = true;
    } catch {
      this.error.set('Could not load books from server.');
    } finally {
      this.loading.set(false);
    }
  }

  async createBook(draft: BookDraft): Promise<void> {
    const createdBook = await firstValueFrom(
      this.http.post<Book>(`${this.apiBaseUrl}/books`, draft)
    );
    this.books.update((books) => [createdBook, ...books]);
  }

  async updateBook(id: number, draft: BookDraft): Promise<void> {
    const updatedBook = await firstValueFrom(
      this.http.put<Book>(`${this.apiBaseUrl}/books/${id}`, draft)
    );
    this.books.update((books) => books.map((book) => (book.id === id ? updatedBook : book)));
  }

  async deleteBook(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiBaseUrl}/books/${id}`));
    this.books.update((books) => books.filter((book) => book.id !== id));
  }

  async toggleFavorite(id: number): Promise<void> {
    const updatedBook = await firstValueFrom(
      this.http.post<Book>(`${this.apiBaseUrl}/books/${id}/favorite`, {})
    );
    this.books.update((books) => books.map((book) => (book.id === id ? updatedBook : book)));
  }
}
