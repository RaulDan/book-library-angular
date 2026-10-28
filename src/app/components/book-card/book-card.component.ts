import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;
  @Input() showCategory = false;

  @Output() edit = new EventEmitter<Book>();
  @Output() toggleFavorite = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  protected get initials(): string {
    return this.book.title
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('');
  }

  protected get coverBackground(): string {
    const gradients = [
      'linear-gradient(135deg, #fde68a, #f59e0b)',
      'linear-gradient(135deg, #bfdbfe, #2563eb)',
      'linear-gradient(135deg, #c4b5fd, #7c3aed)',
      'linear-gradient(135deg, #99f6e4, #0d9488)',
      'linear-gradient(135deg, #fecaca, #ef4444)',
    ];
    const index = this.book.id % gradients.length;
    return gradients[index];
  }
}
