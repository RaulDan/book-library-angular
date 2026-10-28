import { Component } from '@angular/core';
import { DiscoverViewComponent } from './components/discover-view/discover-view.component';
import { CategoriesViewComponent } from './components/categories-view/categories-view.component';
import { FavouritesViewComponent } from './components/favourites-view/favourites-view.component';

type SidebarSection = 'discover' | 'category' | 'favourite';

@Component({
  imports: [DiscoverViewComponent, CategoriesViewComponent, FavouritesViewComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected activeSection: SidebarSection = 'discover';

  protected setActiveSection(section: SidebarSection): void {
    this.activeSection = section;
  }

  protected isActive(section: SidebarSection): boolean {
    return this.activeSection === section;
  }
}
