
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
}

// Mock data
const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "Milk and Honey",
    author: "Ruth Wang",
    isbn: "2B-112",
    category: "Poetry",
    publishedYear: 2015,
    availableCopies: 5,
    totalCopies: 10,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A collection of poetry and prose about survival, the experience of violence, abuse, love, loss, and femininity."
  },
  {
    id: "2",
    title: "Milk and Honey",
    author: "Esther Howard",
    isbn: "1A-100",
    category: "Poetry",
    publishedYear: 2016,
    availableCopies: 3,
    totalCopies: 5,
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A collection of poetry and prose about survival."
  },
  {
    id: "3",
    title: "Milk and Honey",
    author: "Brooklyn Simmons",
    isbn: "2A-002",
    category: "Poetry",
    publishedYear: 2017,
    availableCopies: 2,
    totalCopies: 4,
    coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A collection of poetry and prose."
  },
  {
    id: "4",
    title: "Milk and Honey",
    author: "Devon Lane",
    isbn: "1C-092",
    category: "Poetry",
    publishedYear: 2018,
    availableCopies: 1,
    totalCopies: 3,
    coverImage: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A collection of poetry."
  },
];

const MOCK_BORROWED_BOOKS: BorrowedBook[] = [
  {
    id: "1",
    bookId: "1",
    userId: "2",
    borrowDate: "2023-11-01",
    dueDate: "2023-12-01",
    status: "borrowed",
    book: MOCK_BOOKS[0]
  },
  {
    id: "2",
    bookId: "2",
    userId: "1",
    borrowDate: "2023-10-15",
    dueDate: "2023-11-15",
    status: "overdue",
    book: MOCK_BOOKS[1]
  },
  {
    id: "3",
    bookId: "3",
    userId: "2",
    borrowDate: "2023-11-05",
    dueDate: "2023-12-05",
    returnDate: "2023-11-20",
    status: "returned",
    book: MOCK_BOOKS[2]
  },
];

const MOCK_REQUESTED_BOOKS: RequestedBook[] = [
  {
    id: "1",
    bookId: "1",
    userId: "2",
    requestDate: "2023-11-22",
    status: "pending",
    book: MOCK_BOOKS[0],
    user: {
      id: "2",
      name: "Albert Flores",
      email: "albert@example.com",
      role: "user",
    }
  },
  {
    id: "2",
    bookId: "2",
    userId: "1",
    requestDate: "2023-11-22",
    status: "pending",
    book: MOCK_BOOKS[1],
    user: {
      id: "1",
      name: "Annette Black",
      email: "annette@example.com",
      role: "user",
    }
  },
  {
    id: "3",
    bookId: "3",
    userId: "2",
    requestDate: "2023-11-22",
    status: "pending",
    book: MOCK_BOOKS[2],
    user: {
      id: "3",
      name: "Cody Fisher",
      email: "cody@example.com",
      role: "user",
    }
  },
];

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>(MOCK_BORROWED_BOOKS);
  const [requestedBooks, setRequestedBooks] = useState<RequestedBook[]>(MOCK_REQUESTED_BOOKS);
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
        description: `Thank you for returning the book`,
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
