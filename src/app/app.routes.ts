import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { BookRouting } from './book-routing';

@Component({ template: '<p>Book page not found.</p>' })
class BookPageNotFound {}

const loadHome = () => import('./components/home/home').then((m) => m.Home);

export function createRoutes(routing: BookRouting): Routes {
  const prefixes = new Set([routing.basePath, ...routing.sharedPaths]);
  return [
    ...Array.from(prefixes, (prefix): Routes => {
      const path = prefix.replace(/^\/+|\/+$/g, '');
      return [
        { path, pathMatch: 'full', loadComponent: loadHome },
        { path: path ? `${path}/home` : 'home', loadComponent: loadHome },
      ];
    }).flat(),
    { path: '**', component: BookPageNotFound },
  ];
}
