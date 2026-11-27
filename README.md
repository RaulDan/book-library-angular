# BookLibraryAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.4.

## Module Federation mode

```sh
npm ci
npm run serve:federation
```

Run `npm run start:mock-server` in a separate terminal. Stop standalone `ng serve`
first: both modes use port 4200. The entry is
`http://localhost:4200/remoteEntry.js`, container `book_library`, exposing
`./mount`. Angular and React hosts run on 4201 and 3001.

`npm run build:federation` emits `dist/federation`. Deploy this directory and all
its chunks together; the public path resolves relative to the remote entry.
Production servers must allow both host origins through CORS. The dedicated
build uses Angular 22 AOT, the Babel 8 linker, and Webpack; the existing standalone
Angular application builder remains unchanged. Angular Webpack support is
deprecated upstream, so keep dedicated tooling compatible with Angular 22.

The mount API creates an independent Angular application with Shadow DOM styles
and returns an idempotent disposer. Do not share Angular 22 with the Angular 20
host. Federation builds reuse the existing application, template, and styles;
they do not bootstrap `src/main.ts`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

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
