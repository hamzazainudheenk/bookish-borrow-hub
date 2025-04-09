
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapDbBorrowedBookToBorrowedBook } from "@/lib/supabase-mappers";
import { Book, BorrowedBook } from "@/types";
import { useBooks } from "@/context/BookContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Clock } from "lucide-react";

interface BorrowedBookTableProps {
  searchTerm: string;
  isAdmin: boolean;
}

export const BorrowedBookTable = ({ searchTerm, isAdmin }: BorrowedBookTableProps) => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { books: contextBooks, borrowedBooks: contextBorrowedBooks } = useBooks();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      setIsLoading(true);
      try {
        // Fetch borrowed books from Supabase
        const { data: dbBorrowedBooks, error: borrowedError } = await supabase
          .from("borrowed_books")
          .select("*");

        if (borrowedError) throw borrowedError;

        // Map to our app's data structure
        if (dbBorrowedBooks && dbBorrowedBooks.length > 0) {
          // We need to also fetch books for each borrowed book
          const bookIds = [...new Set(dbBorrowedBooks.map(b => b.book_id))];
          
          // Fetch all books needed at once
          const { data: dbBooks, error: booksError } = await supabase
            .from("books")
            .select("*")
            .in("id", bookIds);
          
          if (booksError) throw booksError;
          
          // Create a lookup map for books
          const booksMap: Record<string, Book> = {};
          
          if (dbBooks && dbBooks.length > 0) {
            dbBooks.forEach(dbBook => {
              const book = {
                id: dbBook.id,
                title: dbBook.title,
                author: dbBook.author,
                isbn: dbBook.isbn || '',
                category: dbBook.category || '',
                publishedYear: 0,
                availableCopies: dbBook.available ? 1 : 0,
                totalCopies: 1,
                coverImage: dbBook.cover_image,
                description: '',
                location: dbBook.shelf_location,
                rating: 0,
                ratingCount: 0,
              };
              booksMap[dbBook.id] = book;
            });
          }
          
          // Map borrowed books with their corresponding book details
          const mappedBooks = dbBorrowedBooks.map(borrowedBook => {
            const bookId = borrowedBook.book_id || '';
            const book = booksMap[bookId] || contextBooks.find(b => b.id === bookId) || {
              id: bookId,
              title: "Unknown Book",
              author: "Unknown Author",
              isbn: "",
              category: "",
              publishedYear: 0,
              availableCopies: 0,
              totalCopies: 0,
              description: ""
            };
            
            return mapDbBorrowedBookToBorrowedBook(borrowedBook, book);
          });
          
          setBorrowedBooks(mappedBooks);
        } else {
          // Fallback to context data if no database results
          setBorrowedBooks(contextBorrowedBooks);
        }
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
        // Fallback to context data if there's an error
        setBorrowedBooks(contextBorrowedBooks);
        toast({
          title: "Failed to fetch borrowed books",
          description: "Using sample data instead",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [contextBooks, contextBorrowedBooks, toast]);

  // Filter borrowed books based on search term
  const filteredBorrowedBooks = borrowedBooks.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.book.title.toLowerCase().includes(searchLower) ||
      item.book.author.toLowerCase().includes(searchLower) ||
      (item.user?.name?.toLowerCase().includes(searchLower)) ||
      item.status.toLowerCase().includes(searchLower)
    );
  });

  const handleRenewBook = (id: string) => {
    toast({
      title: "Renew book",
      description: `Renewing book with ID: ${id}`,
    });
  };

  const handleReturnBook = (id: string) => {
    toast({
      title: "Return book",
      description: `Returning book with ID: ${id}`,
    });
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < now && status === "borrowed";
    
    switch (status) {
      case "borrowed":
        return isOverdue ? (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Borrowed</Badge>
        );
      case "returned":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Returned</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredBorrowedBooks.length === 0) {
    return (
      <div className="text-center py-10">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No borrowed books found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "No books have been borrowed yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            {isAdmin && <TableHead>Borrower</TableHead>}
            <TableHead>Borrow Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBorrowedBooks.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                    {item.book.coverImage ? (
                      <img 
                        src={item.book.coverImage} 
                        alt={item.book.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{item.book.title}</div>
                    <div className="text-sm text-muted-foreground">{item.book.author}</div>
                  </div>
                </div>
              </TableCell>
              
              {isAdmin && (
                <TableCell>
                  {item.user ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {item.user.name.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.user.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unknown User</span>
                  )}
                </TableCell>
              )}
              
              <TableCell>{new Date(item.borrowDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(item.status, item.dueDate)}</TableCell>
              <TableCell>
                {item.status === "borrowed" && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRenewBook(item.id)}
                      disabled={item.renewsLeft === 0}
                    >
                      Renew
                      {item.renewsLeft !== undefined && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({item.renewsLeft})
                        </span>
                      )}
                    </Button>
                    {(isAdmin || (!isAdmin && !item.returnDate)) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleReturnBook(item.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        Return
                      </Button>
                    )}
                  </div>
                )}
                {item.status === "returned" && (
                  <span className="text-sm text-muted-foreground">
                    Returned on {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : "N/A"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
