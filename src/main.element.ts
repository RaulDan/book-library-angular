import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {BookCardComponent} from './app/components/book-card/book-card.component';

createApplication(appConfig)
  .then((application) => {
    const element = createCustomElement(App, {
      injector: application.injector,
    });
    const bookElement = createCustomElement(BookCardComponent, {
      injector: application.injector,
    });

    customElements.define('web-component-book-library-app', element);

    customElements.define('web-component-book-card', bookElement);
  })
  .catch((error) => console.error('Failed to register book library:', error));
