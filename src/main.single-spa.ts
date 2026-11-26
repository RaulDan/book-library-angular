import { APP_ID, ApplicationRef } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import type { AppProps, LifeCycles } from 'single-spa';
import { singleSpaAngular } from 'single-spa-angular';
import { appConfig } from './app/app.config';
import { App } from './app/app';

type Props = { domElement: HTMLElement };

const lifecycles = singleSpaAngular<Props>({
  NgZone: 'noop',
  template: '<book-library-root style="font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"></book-library-root>',
  async bootstrapFunction({ domElement }): Promise<ApplicationRef> {
    const root = domElement.querySelector('book-library-root');
    if (!root) throw new Error('Missing book library root element');
    let instance: ApplicationRef | undefined;
    try {
      instance = await createApplication({
        providers: [...(appConfig.providers ?? []), { provide: APP_ID, useValue: 'book-library' }],
      });
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
