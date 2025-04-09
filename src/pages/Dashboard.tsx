
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useBooks } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowUpIcon, BookOpen, Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { BorrowedBook, Book } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { books, borrowedBooks, requestedBooks, getUserBorrowedBooks } = useBooks();
  const [timeRange, setTimeRange] = useState("all");
  const [userBorrowedBooks, setUserBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [booksRead, setBooksRead] = useState(27);
  const [currentlyBorrowed, setCurrentlyBorrowed] = useState(0);
  const [nextDueDate, setNextDueDate] = useState<{date: string, daysRemaining: number} | null>(null);
  
  // Get user data on component mount
  useEffect(() => {
    if (!isAdmin) {
      // Regular user dashboard
      const userBooks = getUserBorrowedBooks();
      setUserBorrowedBooks(userBooks);
      setCurrentlyBorrowed(userBooks.filter(b => b.status === "borrowed").length);
      
      // Find next due date
      const borrowedItems = userBooks.filter(b => b.status === "borrowed");
      if (borrowedItems.length > 0) {
        // Sort by due date
        borrowedItems.sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        
        const nextDue = borrowedItems[0];
        const dueDate = new Date(nextDue.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setNextDueDate({
          date: nextDue.dueDate,
          daysRemaining: diffDays
        });
      }
      
      // Generate recommended books
      const recommendedSample = books
        .filter(book => !userBooks.some(b => b.bookId === book.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
        
      setRecommendedBooks(recommendedSample);
    }
  }, [isAdmin, books, borrowedBooks, getUserBorrowedBooks]);
  
  // Format date to "Apr 15, 2025" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Generate rating display
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="text-blue-500 mr-1">★</span>
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <PageLayout title="My Dashboard">
      <div className="space-y-6">
        {/* Time range filters */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={timeRange === "all" ? "default" : "outline"}
              className="rounded-l-md rounded-r-none"
              onClick={() => setTimeRange("all")}
            >
              All Time
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              className="rounded-none border-x-0"
              onClick={() => setTimeRange("month")}
            >
              This Month
            </Button>
            <Button
              variant={timeRange === "year" ? "default" : "outline"}
              className="rounded-r-md rounded-l-none"
              onClick={() => setTimeRange("year")}
            >
              This Year
            </Button>
          </div>
        </div>
      
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Currently Borrowed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <div>
                  <div className="text-4xl font-bold">{currentlyBorrowed}</div>
                  <div className="text-xs text-muted-foreground">Out of 5 allowed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <Calendar className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <div>
                  {nextDueDate ? (
                    <>
                      <div className="text-4xl font-bold">{formatDate(nextDueDate.date).replace(',', '')}</div>
                      <div className="text-xs text-muted-foreground">{nextDueDate.daysRemaining} days remaining</div>
                    </>
                  ) : (
                    <div className="text-md">No books due</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Books Read</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <Clock className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <div>
                  <div className="text-4xl font-bold">{booksRead}</div>
                  <div className="text-xs text-green-600 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" /> 4 from last period
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Borrowed Books and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Borrowed Books</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Books you currently have checked out</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userBorrowedBooks
                  .filter(book => book.status === "borrowed")
                  .map((borrowed) => (
                    <div key={borrowed.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-muted flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={borrowed.book.coverImage || "/placeholder.svg"}
                            alt={borrowed.book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{borrowed.book.title}</h4>
                          <p className="text-sm text-muted-foreground">{borrowed.book.author}</p>
                          <div className="mt-1">
                            <div className="text-xs">
                              <span className="text-muted-foreground">Borrowed: </span>
                              {formatDate(borrowed.borrowDate)}
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Due: </span>
                              {formatDate(borrowed.dueDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Renew</Button>
                    </div>
                  ))}
                
                {userBorrowedBooks.filter(book => book.status === "borrowed").length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No books currently borrowed</p>
                    <Button variant="outline" className="mt-2">Browse Books</Button>
                  </div>
                )}
                
                {userBorrowedBooks.filter(book => book.status === "borrowed").length > 0 && (
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommended For You</CardTitle>
              <p className="text-sm text-muted-foreground">Based on your reading history</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recommendedBooks.slice(0, 2).map((book) => (
                  <div key={book.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-muted flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {book.id === "1" && (
                            <div className="flex items-center">
                              <span className="text-blue-500 mr-1">★</span>
                              <span className="text-sm">4.8</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">Science Fiction</span>
                            </div>
                          )}
                          {book.id === "2" && (
                            <div className="flex items-center">
                              <span className="text-blue-500 mr-1">★</span>
                              <span className="text-sm">4.7</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">Fantasy</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600">Reserve</Button>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm">View All</Button>
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
