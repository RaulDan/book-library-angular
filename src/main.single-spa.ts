import { APP_BASE_HREF } from '@angular/common';
import { APP_ID, ApplicationRef } from '@angular/core';
import { createApplication, platformBrowser } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import type { AppProps, LifeCycles } from 'single-spa';
import { provideSingleSpaPlatform, singleSpaAngular } from 'single-spa-angular';
import { createAppConfig } from './app/app.config';
import { App } from './app/app';
import { BookRouting } from './app/book-routing';

type Props = { domElement: HTMLElement; bookRouting: BookRouting };

const lifecycles = singleSpaAngular<Props>({
  NgZone: 'noop',
  Router,
  NavigationStart,
  template: '<book-library-root style="font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"></book-library-root>',
  async bootstrapFunction({ domElement, bookRouting }): Promise<ApplicationRef> {
    const root = domElement.querySelector('book-library-root');
    if (!root) throw new Error('Missing book library root element');
    let instance: ApplicationRef | undefined;
    try {
      instance = await createApplication({
        providers: [
          ...(createAppConfig(bookRouting).providers ?? []),
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: APP_ID, useValue: 'book-library' },
        ],
      }, { platformRef: platformBrowser(provideSingleSpaPlatform()) });
      instance.bootstrap(App, root);
      return instance;
    } catch (error) {
      try {
        instance?.destroy();
      } finally {
        domElement.replaceChildren();
      }
      throw error;
    }
  },
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;

export async function unmount(props: AppProps & Props): Promise<void> {
  try {
    const unmountLifecycles: LifeCycles<Props>['unmount'] = lifecycles.unmount;
    for (const lifecycle of Array.isArray(unmountLifecycles) ? unmountLifecycles : [unmountLifecycles]) {
      await lifecycle(props);
    }
  } finally {
    props.domElement.replaceChildren();
  }
}
