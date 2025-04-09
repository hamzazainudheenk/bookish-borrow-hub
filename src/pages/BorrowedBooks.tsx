import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useBooks } from "@/context/BookContext";
import { BorrowedBook } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, RefreshCwIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BorrowedBooks = () => {
  const { borrowedBooks, returnBook, renewBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleReturn = (id: string) => {
    returnBook(id);
  };

  const handleRenew = (id: string) => {
    renewBook(id);
  };

  const filteredBooks = borrowedBooks.filter((book) => {
    const searchMatch =
      book.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch =
      filterStatus === "all" || book.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <PageLayout title="Borrowed Books" onSearch={handleSearch}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="search">Search:</Label>
          <Input
            type="search"
            id="search"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="filter">Filter by Status:</Label>
            <select
              id="filter"
              className="border rounded px-2 py-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <Button variant="ghost" size="icon">
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.book.title}</TableCell>
                <TableCell>{book.book.author}</TableCell>
                <TableCell>{book.borrowDate}</TableCell>
                <TableCell>{book.dueDate}</TableCell>
                <TableCell>
                  {book.status === "borrowed" && (
                    <span className="text-blue-500">Borrowed</span>
                  )}
                  {book.status === "returned" && (
                    <span className="text-green-500">Returned</span>
                  )}
                  {book.status === "overdue" && (
                    <span className="text-red-500">Overdue</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRenew(book.id)}
                      disabled={book.status !== "borrowed"}
                    >
                      Renew
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReturn(book.id)}
                      disabled={book.status !== "borrowed"}
                    >
                      Return
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default BorrowedBooks;
