
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapDbBookToBook } from "@/lib/supabase-mappers";
import { Book } from "@/types";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useBooks } from "@/context/BookContext";

interface BookTableProps {
  searchTerm: string;
  isAdmin: boolean;
}

export const BookTable = ({ searchTerm, isAdmin }: BookTableProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { books: contextBooks } = useBooks();

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const { data: dbBooks, error } = await supabase
          .from("books")
          .select("*");

        if (error) {
          throw error;
        }

        if (dbBooks && dbBooks.length > 0) {
          const mappedBooks = dbBooks.map(dbBook => mapDbBookToBook(dbBook));
          setBooks(mappedBooks);
        } else {
          // Fallback to context data if no database results
          setBooks(contextBooks);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        // Fallback to context data if there's an error
        setBooks(contextBooks);
        toast({
          title: "Failed to fetch books",
          description: "Using sample data instead",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [contextBooks, toast]);

  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditBook = (id: string) => {
    // Implement edit functionality
    toast({
      title: "Edit book",
      description: `Editing book with ID: ${id}`,
    });
  };

  const handleDeleteBook = (id: string) => {
    // Implement delete functionality
    toast({
      title: "Delete book",
      description: `Deleting book with ID: ${id}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="text-center py-10">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No books found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "There are no books in the database yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Availability</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="font-medium">{book.title}</div>
                </div>
              </TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <Badge variant="outline">{book.category || "Uncategorized"}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
              <TableCell>
                <Badge variant={book.availableCopies > 0 ? "default" : "outline"} className={book.availableCopies > 0 ? "bg-green-500 hover:bg-green-600" : ""}>
                  {book.availableCopies > 0 ? `${book.availableCopies} available` : "Not available"}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditBook(book.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
