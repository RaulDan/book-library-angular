# BookLibraryAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.4.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Iframe host

This application is embedded by the root-level [iframe host](../index.html) and
[alternate host](../index-webEl.html) at
`http://localhost:4200/`. Start its frontend and mock backend together before
opening the host:

```bash
npm run start-all-angular
```

The host also requires the React app on port 3000 and the Svelte app on port
5000. For a production deployment, configure the web server serving this app
to allow the host origin to frame it; do not send `X-Frame-Options: DENY` or a
`Content-Security-Policy` `frame-ancestors` directive that excludes the host.

## Mock backend

Run the Node.js mock backend for books:

```bash
npm run start:mock-server
```

The backend runs on `http://localhost:7002` and loads default data from
`angular-static-mock-server/mock-data/books.json` at startup.

Available endpoints:

- `GET /books`
- `GET /books/:id`
- `POST /books`
- `PUT /books/:id`
- `PATCH /books/:id`
- `DELETE /books/:id`
- `POST /books/:id/favorite`
- `GET /favorites`
- `GET /categories`
- `GET /categories/:name/books`

Run frontend + backend together:

```bash
npm run start-all-angular
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
