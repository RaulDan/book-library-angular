import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { createRoutes } from './app.routes';
import { BOOK_ROUTING, BookRouting } from './book-routing';

export function createAppConfig(routing: BookRouting = { basePath: '', sharedPaths: [] }): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      { provide: BOOK_ROUTING, useValue: routing },
      provideRouter(createRoutes(routing)),
      provideHttpClient()
    ]
  };
}

export const appConfig = createAppConfig();
