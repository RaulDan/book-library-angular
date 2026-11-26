import { InjectionToken } from '@angular/core';

export interface BookRouting {
  basePath: string;
  sharedPaths: string[];
}

export const BOOK_ROUTING = new InjectionToken<BookRouting>('book routing', {
  factory: () => ({ basePath: '', sharedPaths: [] }),
});
