
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapDbRequestedBookToRequestedBook } from "@/lib/supabase-mappers";
import { Book, RequestedBook, User } from "@/types";
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
import { BookOpen, CheckCircle, X } from "lucide-react";

interface RequestedBookTableProps {
  searchTerm: string;
  isAdmin: boolean;
}

export const RequestedBookTable = ({ searchTerm, isAdmin }: RequestedBookTableProps) => {
  const [requestedBooks, setRequestedBooks] = useState<RequestedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { books: contextBooks, requestedBooks: contextRequestedBooks } = useBooks();

  useEffect(() => {
    const fetchRequestedBooks = async () => {
      setIsLoading(true);
      try {
        // Fetch requested books from Supabase
        const { data: dbRequestedBooks, error: requestedError } = await supabase
          .from("requested_books")
          .select("*");

        if (requestedError) throw requestedError;

        // Map to our app's data structure
        if (dbRequestedBooks && dbRequestedBooks.length > 0) {
          // We need to also fetch books and members for each requested book
          const bookIds = [...new Set(dbRequestedBooks.map(r => r.book_id).filter(Boolean))];
          const memberIds = [...new Set(dbRequestedBooks.map(r => r.member_id).filter(Boolean))];
          
          // Fetch all books needed
          const { data: dbBooks, error: booksError } = await supabase
            .from("books")
            .select("*")
            .in("id", bookIds);
          
          if (booksError) throw booksError;
          
          // Fetch all members needed
          const { data: dbMembers, error: membersError } = await supabase
            .from("members")
            .select("*")
            .in("id", memberIds);
          
          if (membersError) throw membersError;
          
          // Create lookup maps for books and members
          const booksMap: Record<string, Book> = {};
          const membersMap: Record<string, User> = {};
          
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
          
          if (dbMembers && dbMembers.length > 0) {
            dbMembers.forEach(dbMember => {
              const member = {
                id: dbMember.id,
                name: dbMember.name,
                email: dbMember.email,
                role: dbMember.role as 'admin' | 'user',
                avatar: dbMember.avatar,
              };
              membersMap[dbMember.id] = member;
            });
          }
          
          // Map requested books with their corresponding book and user details
          const mappedBooks = dbRequestedBooks.map(requestedBook => {
            const bookId = requestedBook.book_id || '';
            const memberId = requestedBook.member_id || '';
            
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
            
            const user = membersMap[memberId] || {
              id: memberId,
              name: "Unknown User",
              email: "unknown@example.com",
              role: "user"
            };
            
            return mapDbRequestedBookToRequestedBook(requestedBook, book, user);
          });
          
          setRequestedBooks(mappedBooks);
        } else {
          // Fallback to context data if no database results
          setRequestedBooks(contextRequestedBooks);
        }
      } catch (error) {
        console.error("Error fetching requested books:", error);
        // Fallback to context data if there's an error
        setRequestedBooks(contextRequestedBooks);
        toast({
          title: "Failed to fetch requested books",
          description: "Using sample data instead",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestedBooks();
  }, [contextBooks, contextRequestedBooks, toast]);

  // Filter requested books based on search term
  const filteredRequestedBooks = requestedBooks.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.book.title.toLowerCase().includes(searchLower) ||
      item.book.author.toLowerCase().includes(searchLower) ||
      item.user.name.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    );
  });

  const handleApproveRequest = (id: string) => {
    toast({
      title: "Approve request",
      description: `Approving request with ID: ${id}`,
    });
  };

  const handleRejectRequest = (id: string) => {
    toast({
      title: "Reject request",
      description: `Rejecting request with ID: ${id}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
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

  if (filteredRequestedBooks.length === 0) {
    return (
      <div className="text-center py-10">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No requested books found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "No books have been requested yet"}
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
            {isAdmin && <TableHead>Requested By</TableHead>}
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequestedBooks.map((item) => (
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
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {item.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.user.name}</span>
                  </div>
                </TableCell>
              )}
              
              <TableCell>{new Date(item.requestDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              
              {isAdmin && (
                <TableCell>
                  {item.status === "pending" ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleApproveRequest(item.id)}
                        disabled={item.book.availableCopies <= 0}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectRequest(item.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {item.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  )}
                  
                  {item.status === "pending" && item.book.availableCopies <= 0 && (
                    <div className="text-xs text-red-500 mt-1">
                      No copies available
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
