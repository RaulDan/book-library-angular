export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  isFavorite: boolean;
}

export interface BookDraft {
  title: string;
  author: string;
  description: string;
  category: string;
}
