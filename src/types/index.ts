
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  coverImage?: string;
  description?: string;
  location?: string;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  book: Book;
  user?: User;
}

export interface RequestedBook {
  id: string;
  bookId: string;
  userId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  book: Book;
  user: User;
}
