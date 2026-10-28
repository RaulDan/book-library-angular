import { Component, OnInit, inject } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { Book, BookDraft } from '../../models/book.model';
import { BooksApiService } from '../../services/books-api.service';

@Component({
  selector: 'app-favourites-view',
  imports: [BookCardComponent, BookDialogComponent],
  templateUrl: './favourites-view.component.html',
  styleUrl: './favourites-view.component.scss',
})
export class FavouritesViewComponent implements OnInit {
  protected readonly booksApi = inject(BooksApiService);

  protected isDialogOpen = false;
  protected selectedBook: Book | null = null;
  protected isSaving = false;
  protected dialogError = '';

  async ngOnInit(): Promise<void> {
    await this.booksApi.ensureLoaded();
  }

  protected get favouriteBooks(): Book[] {
    return this.booksApi.favoriteBooks();
  }

  protected get categories(): string[] {
    return this.booksApi.categories();
  }

  protected openEditDialog(book: Book): void {
    this.selectedBook = book;
    this.dialogError = '';
    this.isDialogOpen = true;
  }

  protected closeDialog(): void {
    this.isDialogOpen = false;
    this.dialogError = '';
  }

  protected async saveBook(draft: BookDraft): Promise<void> {
    if (!this.selectedBook) {
      return;
    }

    this.isSaving = true;
    this.dialogError = '';

    try {
      await this.booksApi.updateBook(this.selectedBook.id, draft);
      this.closeDialog();
    } catch {
      this.dialogError = 'Could not save the book.';
    } finally {
      this.isSaving = false;
    }
  }

  protected async toggleFavorite(bookId: number): Promise<void> {
    try {
      await this.booksApi.toggleFavorite(bookId);
    } catch {
      this.booksApi.error.set('Could not update favorite status.');
    }
  }

  protected async deleteBook(bookId: number): Promise<void> {
    if (!confirm('Delete this book?')) {
      return;
    }
    try {
      await this.booksApi.deleteBook(bookId);
    } catch {
      this.booksApi.error.set('Could not delete the book.');
    }
  }
}
