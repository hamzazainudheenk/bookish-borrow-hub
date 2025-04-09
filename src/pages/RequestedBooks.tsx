
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useBooks } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, CheckCircle, Filter, Search, X } from "lucide-react";
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

const RequestedBooks = () => {
  const { requestedBooks, approveRequest, rejectRequest, isLoading } = useBooks();
  const { isAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  
  let displayedRequestedBooks = isAdmin
    ? requestedBooks
    : requestedBooks.filter(item => item.userId === user?.id);
  
  // Apply filters
  if (statusFilter !== "all") {
    displayedRequestedBooks = displayedRequestedBooks.filter(item => item.status === statusFilter);
  }
  
  if (searchTerm) {
    displayedRequestedBooks = displayedRequestedBooks.filter(
      item => 
        item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
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
  
  return (
    <PageLayout title="Requested Books" subtitle="Manage book requests">
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
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                  Rejected
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
          <CardTitle>Requested Books</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Manage book requests from users"
              : "Your book requests"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayedRequestedBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRequestedBooks.map((item) => (
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
                                onClick={() => approveRequest(item.id)}
                                disabled={isLoading || item.book.availableCopies <= 0}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => rejectRequest(item.id)}
                                disabled={isLoading}
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
          ) : (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No requested books found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try changing your filters"
                  : isAdmin
                    ? "No book requests at the moment"
                    : "You haven't requested any books yet"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default RequestedBooks;
