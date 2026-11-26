import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { DiscoverViewComponent } from './components/discover-view/discover-view.component';
import { CategoriesViewComponent } from './components/categories-view/categories-view.component';
import { FavouritesViewComponent } from './components/favourites-view/favourites-view.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BOOK_ROUTING } from './book-routing';

type SidebarSection = 'discover' | 'category' | 'favourite';

@Component({
  imports: [DiscoverViewComponent, CategoriesViewComponent, FavouritesViewComponent, RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly routing = inject(BOOK_ROUTING);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private hostPath = window.location.pathname;
  protected activeSection: SidebarSection = 'discover';

  constructor() {
    if (this.routing.sharedPaths.length) {
      // The book app can stay mounted when the host changes between individual and shared paths.
      const onHostRouting = () => {
        const path = window.location.pathname;
        if (path === this.hostPath) return;
        this.hostPath = path;
        this.changeDetector.markForCheck();
        const target = `${path}${window.location.search}${window.location.hash}`;
        const pending = this.router.currentNavigation()?.extractedUrl.toString();
        if (this.router.url !== target && pending !== target) {
          void this.router.navigateByUrl(target, { skipLocationChange: true }).catch((error) => {
            console.error('Could not synchronize book navigation with the host:', error);
          });
        }
      };
      window.addEventListener('single-spa:routing-event', onHostRouting);
      inject(DestroyRef).onDestroy(() => window.removeEventListener('single-spa:routing-event', onHostRouting));
    }
  }

  protected get sharedPath(): string | undefined {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return this.routing.sharedPaths.find((shared) => (shared.replace(/\/+$/, '') || '/') === path);
  }

  protected get homeLink(): string {
    return `${this.sharedPath ?? this.routing.basePath}/home`.replace(/\/+/g, '/');
  }

  protected openSharedHome(): void {
    void this.router.navigateByUrl(this.homeLink, { skipLocationChange: true }).catch((error) => {
      console.error('Could not open the book home page:', error);
    });
  }

  protected setActiveSection(section: SidebarSection): void {
    this.activeSection = section;
  }

  protected isActive(section: SidebarSection): boolean {
    return this.activeSection === section;
  }
}
