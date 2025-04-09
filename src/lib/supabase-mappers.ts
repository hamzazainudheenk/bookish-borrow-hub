
import { Book, BorrowedBook, RequestedBook, User } from "@/types";
import { Database } from "@/integrations/supabase/types";

// Type aliases for Supabase table rows
type DbBook = Database["public"]["Tables"]["books"]["Row"];
type DbMember = Database["public"]["Tables"]["members"]["Row"];
type DbBorrowedBook = Database["public"]["Tables"]["borrowed_books"]["Row"];
type DbRequestedBook = Database["public"]["Tables"]["requested_books"]["Row"];

// Functions to convert from Supabase types to our application types
export function mapDbBookToBook(dbBook: DbBook): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    isbn: dbBook.isbn || '',
    category: dbBook.category || '',
    publishedYear: 0, // Not in DB schema, would need to be added
    availableCopies: dbBook.available ? 1 : 0,
    totalCopies: 1,
    coverImage: dbBook.cover_image || undefined,
    description: '', // Not in DB schema, would need to be added
    location: dbBook.shelf_location || undefined,
    rating: 0, // Not in DB schema, would need to be added
    ratingCount: 0, // Not in DB schema, would need to be added
  };
}

export function mapDbMemberToUser(dbMember: DbMember): User {
  return {
    id: dbMember.id,
    name: dbMember.name,
    email: dbMember.email,
    role: dbMember.role as 'admin' | 'user' || 'user',
    avatar: dbMember.avatar,
  };
}

export function mapDbBorrowedBookToBorrowedBook(
  dbBorrowedBook: DbBorrowedBook, 
  book: Book,
  user?: User
): BorrowedBook {
  return {
    id: dbBorrowedBook.id,
    bookId: dbBorrowedBook.book_id || '',
    userId: dbBorrowedBook.member_id || '',
    borrowDate: dbBorrowedBook.borrow_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    dueDate: dbBorrowedBook.due_date.split('T')[0],
    returnDate: dbBorrowedBook.return_date?.split('T')[0],
    status: (dbBorrowedBook.status as 'borrowed' | 'returned' | 'overdue') || 'borrowed',
    book,
    user,
    renewsLeft: 2, // Not in DB schema, would need to be added
  };
}

export function mapDbRequestedBookToRequestedBook(
  dbRequestedBook: DbRequestedBook, 
  book: Book,
  user: User
): RequestedBook {
  return {
    id: dbRequestedBook.id,
    bookId: dbRequestedBook.book_id || '',
    userId: dbRequestedBook.member_id || '',
    requestDate: dbRequestedBook.request_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    status: (dbRequestedBook.status as 'pending' | 'approved' | 'rejected') || 'pending',
    book,
    user,
  };
}
