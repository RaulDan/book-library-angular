# BookLibraryAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.4.

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

Run the standalone frontend, backend, and watched single-spa bundle together:

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

For single-spa, run `npm run build:single-spa`. The ES module in
`dist/single-spa/browser/main.js` exports `bootstrap`, `mount`, and `unmount`;
the host must pass a `domElement` custom prop. The entry uses
`single-spa-angular` to manage the Angular application lifecycle.
`npm run start-all-angular` builds and watches this bundle, starts the book API,
and serves both the standalone app and the bundle on port 4200 with CORS
enabled. Hosts load `http://localhost:4200/single-spa/main.js`. The regular
`npm start` starts only the development server; build the single-spa bundle
first if you also want to load it from a host.

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
