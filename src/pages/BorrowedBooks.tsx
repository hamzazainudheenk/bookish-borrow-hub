
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useBooks } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import { BorrowedBook } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, CheckCircle2, Filter, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BorrowedBooks = () => {
  const { borrowedBooks, returnBook, isLoading } = useBooks();
  const { isAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "borrowed" | "returned" | "overdue">("all");
  const [selectedItem, setSelectedItem] = useState<BorrowedBook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  let displayedBorrowedBooks = isAdmin
    ? borrowedBooks
    : borrowedBooks.filter(item => item.userId === user?.id);
  
  // Apply filters
  if (statusFilter !== "all") {
    displayedBorrowedBooks = displayedBorrowedBooks.filter(item => item.status === statusFilter);
  }
  
  if (searchTerm) {
    displayedBorrowedBooks = displayedBorrowedBooks.filter(
      item => 
        item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Paginate
  const totalPages = Math.ceil(displayedBorrowedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = displayedBorrowedBooks.slice(startIndex, startIndex + itemsPerPage);
  
  const openReturnDialog = (item: BorrowedBook) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  
  const handleReturn = async () => {
    if (selectedItem) {
      try {
        await returnBook(selectedItem.id);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error returning book:", error);
      }
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "borrowed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Borrowed</Badge>;
      case "returned":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Returned</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <PageLayout title="Borrowed Books" subtitle="Track all borrowed books">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("borrowed")}>
                  Borrowed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("returned")}>
                  Returned
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>
                  Overdue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Borrowed Books</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Manage all borrowed books in the library"
              : "Your borrowed books"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    {isAdmin && <TableHead>User</TableHead>}
                    <TableHead>Borrowed Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBooks.map((item) => (
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
                            <div className="text-xs text-muted-foreground">{item.book.isbn}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {item.user?.name.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span>{item.user?.name || "Unknown User"}</span>
                          </div>
                        </TableCell>
                      )}
                      
                      <TableCell>{new Date(item.borrowDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.status === "borrowed" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openReturnDialog(item)}
                            disabled={isLoading}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Return
                          </Button>
                        )}
                        
                        {item.status === "returned" && (
                          <span className="text-sm text-muted-foreground">
                            Returned on {item.returnDate && new Date(item.returnDate).toLocaleDateString()}
                          </span>
                        )}
                        
                        {item.status === "overdue" && (
                          <div className="space-y-1">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => openReturnDialog(item)}
                              disabled={isLoading}
                            >
                              Return Now
                            </Button>
                            <div className="text-xs text-red-500">
                              Overdue fine applies
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No borrowed books found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try changing your filters"
                  : "You haven't borrowed any books yet"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Return Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to return this book?
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                  {selectedItem.book.coverImage ? (
                    <img 
                      src={selectedItem.book.coverImage} 
                      alt={selectedItem.book.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{selectedItem.book.title}</div>
                  <div className="text-sm text-muted-foreground">{selectedItem.book.author}</div>
                  <div className="text-sm">
                    Due: {new Date(selectedItem.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {selectedItem.status === "overdue" && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                  <p className="font-medium">This book is overdue!</p>
                  <p>A late fee may apply according to library policy.</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturn} disabled={isLoading}>
              Confirm Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default BorrowedBooks;
