import { Component, ViewEncapsulation, createComponent } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { App } from '../app/app';
import { appConfig } from '../app/app.config';

@Component({
  selector: 'book-library-remote',
  imports: [App],
  template: '<app-root />',
  encapsulation: ViewEncapsulation.ShadowDom,
  styles: `
    :host {
      display: block;
      container-type: inline-size;
      color: #c6bb32;
      font: 16px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #580c14;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }
  `,
})
class BookLibraryRemote {}

export async function mount(container: HTMLElement): Promise<() => void> {
  const application = await createApplication(appConfig);
  const host = document.createElement('book-library-remote');
  container.append(host);
  try {
    const component = createComponent(BookLibraryRemote, {
      environmentInjector: application.injector,
      hostElement: host,
    });
    application.attachView(component.hostView);
    component.changeDetectorRef.detectChanges();
  } catch (error) {
    application.destroy();
    host.remove();
    throw error;
  }

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    application.destroy();
    host.remove();
  };
}
