import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book, BookDraft } from '../../models/book.model';

@Component({
  selector: 'app-book-dialog',
  imports: [FormsModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
})
export class BookDialogComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() book: Book | null = null;
  @Input() categories: string[] = [];
  @Input() errorMessage = '';
  @Input() isSaving = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<BookDraft>();

  protected formValue: BookDraft = this.createEmptyDraft();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] || changes['book'] || changes['mode']) {
      this.formValue = this.book
        ? {
            title: this.book.title,
            author: this.book.author,
            description: this.book.description,
            category: this.book.category,
          }
        : this.createEmptyDraft();
    }
  }

  protected onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  protected submit(): void {
    this.save.emit({
      title: this.formValue.title.trim(),
      author: this.formValue.author.trim(),
      description: this.formValue.description.trim(),
      category: this.formValue.category.trim(),
    });
  }

  private createEmptyDraft(): BookDraft {
    return {
      title: '',
      author: '',
      description: '',
      category: '',
    };
  }
}
