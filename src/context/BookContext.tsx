
import React, { createContext, useContext, useState } from "react";
import { Book, BorrowedBook, RequestedBook, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface BookContextType {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  requestedBooks: RequestedBook[];
  isLoading: boolean;
  addBook: (book: Omit<Book, "id">) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (bookId: string) => Promise<void>;
  returnBook: (borrowId: string) => Promise<void>;
  requestBook: (bookId: string) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  getUserBorrowedBooks: () => BorrowedBook[];
  getUserRequestedBooks: () => RequestedBook[];
  renewBook: (borrowId: string) => Promise<void>;
}

// Real book data
const REAL_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    category: "Classic",
    publishedYear: 1925,
    availableCopies: 3,
    totalCopies: 5,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    rating: 4.3,
    location: "Fiction Section - Shelf A3"
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    category: "Classic",
    publishedYear: 1960,
    availableCopies: 2,
    totalCopies: 4,
    coverImage: "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and has become a classic of modern American literature. The plot and characters are loosely based on the author's observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was ten.",
    rating: 4.5,
    location: "Fiction Section - Shelf B2"
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    category: "Dystopian",
    publishedYear: 1949,
    availableCopies: 1,
    totalCopies: 3,
    coverImage: "https://images.unsplash.com/photo-1571167366136-b57e07761625?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "1984 is a dystopian novel by English novelist George Orwell. It was published in June 1949 by Secker & Warburg as Orwell's ninth and final book completed in his lifetime. The story was mostly written at Barnhill, a farmhouse on the Scottish island of Jura, at times while Orwell suffered from severe tuberculosis.",
    rating: 4.6,
    location: "Fiction Section - Shelf C1"
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0141439518",
    category: "Romance",
    publishedYear: 1813,
    availableCopies: 2,
    totalCopies: 3,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    rating: 4.2,
    location: "Fiction Section - Shelf A1"
  },
  {
    id: "5",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441172719",
    category: "Science Fiction",
    publishedYear: 1965,
    availableCopies: 3,
    totalCopies: 5,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Dune is a 1965 science fiction novel by American author Frank Herbert, originally published as two separate serials in Analog magazine. It tied with Roger Zelazny's This Immortal for the Hugo Award in 1966, and it won the inaugural Nebula Award for Best Novel.",
    rating: 4.8,
    location: "Science Fiction - Shelf D2"
  },
  {
    id: "6",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928227",
    category: "Fantasy",
    publishedYear: 1937,
    availableCopies: 1,
    totalCopies: 3,
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
    rating: 4.7,
    location: "Fantasy - Shelf E4"
  }
];

// Updated borrowed books data
const REAL_BORROWED_BOOKS: BorrowedBook[] = [
  {
    id: "1",
    bookId: "1",
    userId: "2",
    borrowDate: "2025-03-30",
    dueDate: "2025-04-15",
    status: "borrowed",
    book: REAL_BOOKS[0],
    renewsLeft: 2
  },
  {
    id: "2",
    bookId: "2",
    userId: "2",
    borrowDate: "2025-04-02", 
    dueDate: "2025-04-18",
    status: "borrowed",
    book: REAL_BOOKS[1],
    renewsLeft: 2
  },
  {
    id: "3",
    bookId: "3",
    userId: "2",
    borrowDate: "2025-03-15",
    dueDate: "2025-04-05",
    returnDate: "2025-04-02",
    status: "returned",
    book: REAL_BOOKS[2]
  },
];

// Updated requested books
const REAL_REQUESTED_BOOKS: RequestedBook[] = [
  {
    id: "1",
    bookId: "5",
    userId: "2",
    requestDate: "2025-04-08",
    status: "pending",
    book: REAL_BOOKS[4],
    user: {
      id: "2",
      name: "Regular User",
      email: "user@bibliomane.com",
      role: "user"
    }
  }
];

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(REAL_BOOKS);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>(REAL_BORROWED_BOOKS);
  const [requestedBooks, setRequestedBooks] = useState<RequestedBook[]>(REAL_REQUESTED_BOOKS);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addBook = async (book: Omit<Book, "id">) => {
    setIsLoading(true);
    try {
      // Mock implementation - would be replaced with actual API call
      const newBook: Book = {
        ...book,
        id: `book-${Date.now()}`,
      };
      
      setBooks(prev => [...prev, newBook]);
      toast({
        title: "Book added",
        description: `"${book.title}" has been added to the library`,
      });
    } catch (error) {
      toast({
        title: "Failed to add book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (id: string, bookUpdate: Partial<Book>) => {
    setIsLoading(true);
    try {
      // Mock implementation - would be replaced with actual API call
      setBooks(prev => 
        prev.map(book => 
          book.id === id ? { ...book, ...bookUpdate } : book
        )
      );
      
      toast({
        title: "Book updated",
        description: "Book information has been updated",
      });
    } catch (error) {
      toast({
        title: "Failed to update book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock implementation - would be replaced with actual API call
      setBooks(prev => prev.filter(book => book.id !== id));
      
      toast({
        title: "Book deleted",
        description: "Book has been removed from the library",
      });
    } catch (error) {
      toast({
        title: "Failed to delete book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const borrowBook = async (bookId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to borrow books",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock implementation - would be replaced with actual API call
      const book = books.find(b => b.id === bookId);
      
      if (!book) {
        throw new Error("Book not found");
      }
      
      if (book.availableCopies <= 0) {
        throw new Error("No copies available for borrowing");
      }
      
      // Update book availability
      setBooks(prev => 
        prev.map(b => 
          b.id === bookId 
            ? { ...b, availableCopies: b.availableCopies - 1 } 
            : b
        )
      );
      
      // Create borrowed record
      const borrowDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      
      const newBorrow: BorrowedBook = {
        id: `borrow-${Date.now()}`,
        bookId,
        userId: user.id,
        borrowDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: "borrowed",
        book: { ...book, availableCopies: book.availableCopies - 1 },
        renewsLeft: 2
      };
      
      setBorrowedBooks(prev => [...prev, newBorrow]);
      
      toast({
        title: "Book borrowed",
        description: `You have borrowed "${book.title}". Please return by ${dueDate.toLocaleDateString()}`,
      });
    } catch (error) {
      toast({
        title: "Failed to borrow book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const returnBook = async (borrowId: string) => {
    setIsLoading(true);
    try {
      // Find the borrowed book record
      const borrowedBook = borrowedBooks.find(b => b.id === borrowId);
      
      if (!borrowedBook) {
        throw new Error("Borrowed book record not found");
      }
      
      // Update book availability
      setBooks(prev => 
        prev.map(b => 
          b.id === borrowedBook.bookId 
            ? { ...b, availableCopies: b.availableCopies + 1 } 
            : b
        )
      );
      
      // Update borrowed record
      const returnDate = new Date().toISOString().split('T')[0];
      
      setBorrowedBooks(prev => 
        prev.map(b => 
          b.id === borrowId 
            ? { 
                ...b, 
                status: "returned", 
                returnDate 
              } 
            : b
        )
      );
      
      toast({
        title: "Book returned",
        description: `Thank you for returning "${borrowedBook.book.title}"`,
      });
    } catch (error) {
      toast({
        title: "Failed to return book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const renewBook = async (borrowId: string) => {
    setIsLoading(true);
    try {
      // Find the borrowed book record
      const borrowedBook = borrowedBooks.find(b => b.id === borrowId);
      
      if (!borrowedBook) {
        throw new Error("Borrowed book record not found");
      }
      
      if (!borrowedBook.renewsLeft || borrowedBook.renewsLeft <= 0) {
        throw new Error("No renewals left for this book");
      }
      
      // Calculate new due date (14 days from current due date)
      const currentDueDate = new Date(borrowedBook.dueDate);
      const newDueDate = new Date(currentDueDate);
      newDueDate.setDate(newDueDate.getDate() + 14);
      
      // Update borrowed record
      setBorrowedBooks(prev => 
        prev.map(b => 
          b.id === borrowId 
            ? { 
                ...b, 
                dueDate: newDueDate.toISOString().split('T')[0],
                renewsLeft: (b.renewsLeft ? b.renewsLeft - 1 : 0)
              } 
            : b
        )
      );
      
      toast({
        title: "Book renewed",
        description: `The book has been renewed until ${newDueDate.toLocaleDateString()}`,
      });
    } catch (error) {
      toast({
        title: "Failed to renew book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestBook = async (bookId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to request books",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock implementation - would be replaced with actual API call
      const book = books.find(b => b.id === bookId);
      
      if (!book) {
        throw new Error("Book not found");
      }
      
      // Check if user already requested this book
      const existingRequest = requestedBooks.find(
        r => r.bookId === bookId && r.userId === user.id && r.status === "pending"
      );
      
      if (existingRequest) {
        throw new Error("You have already requested this book");
      }
      
      // Create request record
      const requestDate = new Date().toISOString().split('T')[0];
      
      const newRequest: RequestedBook = {
        id: `request-${Date.now()}`,
        bookId,
        userId: user.id,
        requestDate,
        status: "pending",
        book,
        user: user,
      };
      
      setRequestedBooks(prev => [...prev, newRequest]);
      
      toast({
        title: "Book requested",
        description: `Your request for "${book.title}" has been submitted`,
      });
    } catch (error) {
      toast({
        title: "Failed to request book",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      const request = requestedBooks.find(r => r.id === requestId);
      
      if (!request) {
        throw new Error("Request not found");
      }
      
      // Update request status
      setRequestedBooks(prev => 
        prev.map(r => 
          r.id === requestId ? { ...r, status: "approved" } : r
        )
      );
      
      // Automatically borrow the book for the user
      const book = books.find(b => b.id === request.bookId);
      
      if (!book) {
        throw new Error("Book not found");
      }
      
      if (book.availableCopies <= 0) {
        throw new Error("No copies available for borrowing");
      }
      
      // Update book availability
      setBooks(prev => 
        prev.map(b => 
          b.id === request.bookId 
            ? { ...b, availableCopies: b.availableCopies - 1 } 
            : b
        )
      );
      
      // Create borrowed record
      const borrowDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      
      const newBorrow: BorrowedBook = {
        id: `borrow-${Date.now()}`,
        bookId: request.bookId,
        userId: request.userId,
        borrowDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: "borrowed",
        book: { ...book, availableCopies: book.availableCopies - 1 },
        user: request.user,
        renewsLeft: 2
      };
      
      setBorrowedBooks(prev => [...prev, newBorrow]);
      
      toast({
        title: "Request approved",
        description: `The book request has been approved`,
      });
    } catch (error) {
      toast({
        title: "Failed to approve request",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      // Update request status
      setRequestedBooks(prev => 
        prev.map(r => 
          r.id === requestId ? { ...r, status: "rejected" } : r
        )
      );
      
      toast({
        title: "Request rejected",
        description: `The book request has been rejected`,
      });
    } catch (error) {
      toast({
        title: "Failed to reject request",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserBorrowedBooks = () => {
    if (!user) return [];
    return borrowedBooks.filter(b => b.userId === user.id);
  };

  const getUserRequestedBooks = () => {
    if (!user) return [];
    return requestedBooks.filter(r => r.userId === user.id);
  };

  const value = {
    books,
    borrowedBooks,
    requestedBooks,
    isLoading,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    requestBook,
    approveRequest,
    rejectRequest,
    getUserBorrowedBooks,
    getUserRequestedBooks,
    renewBook,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
