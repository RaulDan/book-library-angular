import { Component, createComponent, ViewEncapsulation } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { App } from '../app/app';
import { appConfig } from '../app/app.config';
import { DiscoverViewComponent } from '../app/components/discover-view/discover-view.component';
import { CategoriesViewComponent } from '../app/components/categories-view/categories-view.component';
import { FavouritesViewComponent } from '../app/components/favourites-view/favourites-view.component';

@Component({
  selector: 'book-library-remote',
  imports: [DiscoverViewComponent, CategoriesViewComponent, FavouritesViewComponent],
  templateUrl: '../app/app.html',
  styleUrls: ['../app/app.scss'],
  styles: [
    `
      :host {
        display: block;
        font-family: Inter, sans-serif;
        background: #edf1f7;
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
class FederationApp extends App {}

export async function mount(container: HTMLElement): Promise<() => void> {
  const application = await createApplication(appConfig);
  const target = document.createElement('book-library-remote');
  container.append(target);
  try {
    const component = createComponent(FederationApp, {
      hostElement: target,
      environmentInjector: application.injector,
    });
    application.attachView(component.hostView);
    component.changeDetectorRef.detectChanges();
    let disposed = false;
    return () => {
      if (disposed) return;
      disposed = true;
      try {
        component.destroy();
      } finally {
        application.destroy();
        target.remove();
      }
    };
  } catch (error) {
    application.destroy();
    target.remove();
    throw error;
  }
}
