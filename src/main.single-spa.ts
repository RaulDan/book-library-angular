import { APP_ID, ApplicationRef } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

type Props = { domElement: HTMLElement };
let application: ApplicationRef | undefined;

const lifecycles = {
  async bootstrap(): Promise<void> {},
  async mount({ domElement }: Props): Promise<void> {
    const root = document.createElement('book-library-root');
    root.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    domElement.replaceChildren(root);
    const instance = await createApplication({
      providers: [...(appConfig.providers ?? []), { provide: APP_ID, useValue: 'book-library' }],
    });
    try {
      instance.bootstrap(App, root);
      application = instance;
    } catch (error) {
      instance.destroy();
      root.remove();
      throw error;
    }
  },
  async unmount({ domElement }: Props): Promise<void> {
    application?.destroy();
    application = undefined;
    domElement.replaceChildren();
  },
};

Object.assign(window, { bookLibrarySingleSpa: lifecycles });
