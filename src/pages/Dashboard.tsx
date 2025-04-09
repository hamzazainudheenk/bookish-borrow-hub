
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useBooks } from "@/context/BookContext";
import { ArrowDownIcon, ArrowUpIcon, FilterIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorrowedBook } from "@/types";

const Dashboard = () => {
  const { books, borrowedBooks, requestedBooks } = useBooks();
  const [timeRange, setTimeRange] = useState("7");
  const [overdueBooks, setOverdueBooks] = useState<BorrowedBook[]>([]);
  
  // Calculate statistics
  const totalBooks = books.length;
  const availableBooks = books.reduce((acc, book) => acc + book.availableCopies, 0);
  const borrowedCount = borrowedBooks.filter(b => b.status === "borrowed").length;
  const pendingRequests = requestedBooks.filter(r => r.status === "pending").length;
  
  useEffect(() => {
    // Get overdue books
    const today = new Date();
    const overdue = borrowedBooks.filter(book => {
      if (book.status !== "borrowed") return false;
      const dueDate = new Date(book.dueDate);
      return dueDate < today;
    });
    
    setOverdueBooks(overdue);
  }, [borrowedBooks]);
  
  return (
    <PageLayout title="Overview">
      <div className="grid gap-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Borrowed books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-bold">{borrowedCount}</div>
                <div className="stat-up">
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> 12%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-bold">{overdueBooks.length}</div>
                <div>
                  <span className="badge-warning">
                    {overdueBooks.length} pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-bold">24</div>
                <div className="stat-up">
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> 7%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Requested books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-bold">{pendingRequests}</div>
                <div>
                  <span className="badge-warning">
                    {pendingRequests} pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Requested Books */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Overdue book list</CardTitle>
                <CardDescription>Books that are past their due date</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Overdue</TableHead>
                    <TableHead>Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>22345</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <span>Annette Black</span>
                      </div>
                    </TableCell>
                    <TableCell>1 day</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                        Rs. 100
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21342</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=44" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <span>Darlene Robertson</span>
                      </div>
                    </TableCell>
                    <TableCell>2 days</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                        Rs. 120
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12007</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=59" />
                          <AvatarFallback>JJ</AvatarFallback>
                        </Avatar>
                        <span>Jacob Jones</span>
                      </div>
                    </TableCell>
                    <TableCell>2 days</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                        Rs. 120
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>32143</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=47" />
                          <AvatarFallback>AM</AvatarFallback>
                        </Avatar>
                        <span>Arlene McCoy</span>
                      </div>
                    </TableCell>
                    <TableCell>2 days</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                        Rs. 120
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>28653</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                          <AvatarFallback>CW</AvatarFallback>
                        </Avatar>
                        <span>Cameron Williamson</span>
                      </div>
                    </TableCell>
                    <TableCell>3 days</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                        Rs. 140
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost">See all</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requested books</CardTitle>
              <CardDescription>Recent book requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 bg-muted flex-shrink-0 rounded overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Book cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Milk and Honey</h4>
                    <p className="text-sm text-muted-foreground">Ruth Wong</p>
                    <div className="text-xs mt-1 flex justify-between items-center">
                      <span className="text-muted-foreground">2B - 112</span>
                      <span className="font-medium">Requested by</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback>AF</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Albert Flores</span>
                      <span className="text-xs text-muted-foreground">12 Nov, 22</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 bg-muted flex-shrink-0 rounded overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Book cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Milk and Honey</h4>
                    <p className="text-sm text-muted-foreground">Esther Howard</p>
                    <div className="text-xs mt-1 flex justify-between items-center">
                      <span className="text-muted-foreground">1A - 100</span>
                      <span className="font-medium">Requested by</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Annette Black</span>
                      <span className="text-xs text-muted-foreground">12 Nov, 22</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 bg-muted flex-shrink-0 rounded overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Book cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Milk and Honey</h4>
                    <p className="text-sm text-muted-foreground">Brooklyn Simmons</p>
                    <div className="text-xs mt-1 flex justify-between items-center">
                      <span className="text-muted-foreground">2A - 002</span>
                      <span className="font-medium">Requested by</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback>CF</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Cody Fisher</span>
                      <span className="text-xs text-muted-foreground">11 Nov, 22</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
