import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useBooks } from "@/context/BookContext";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Book } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Books = () => {
  const { books, addBook: addNewBook, updateBook, deleteBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publishedYear: 2000,
    availableCopies: 1,
    totalCopies: 1,
    description: "",
    coverImage: "",
    location: "",
  });
  const { toast } = useToast();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fix the addBook function to ensure all required properties in Book type are provided
  const addBook = (formData: any) => {
    const newBook: Omit<Book, "id"> = {
      title: formData.title,             // Required fields must be included
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      publishedYear: formData.publishedYear,
      availableCopies: formData.availableCopies,
      totalCopies: formData.totalCopies,
      // Optional fields
      description: formData.description || "",
      coverImage: formData.coverImage || "",
      location: formData.location || ""
    };
    
    addNewBook(newBook);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBook(formData);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      publishedYear: 2000,
      availableCopies: 1,
      totalCopies: 1,
      description: "",
      coverImage: "",
      location: "",
    });
  };

  const handleDeleteBook = (id: string) => {
    deleteBook(id);
  };

  return (
    <PageLayout title="Books" subtitle="Manage library books" onSearch={handleSearch}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">Total books: {books.length}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Create a new book in the library</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="Enter ISBN"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input
                    id="publishedYear"
                    name="publishedYear"
                    type="number"
                    value={formData.publishedYear}
                    onChange={handleChange}
                    placeholder="Enter published year"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availableCopies">Available Copies</Label>
                  <Input
                    id="availableCopies"
                    name="availableCopies"
                    type="number"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    placeholder="Enter available copies"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalCopies">Total Copies</Label>
                  <Input
                    id="totalCopies"
                    name="totalCopies"
                    type="number"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    placeholder="Enter total copies"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="Enter cover image URL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Book</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          updateBook(book.id, { title: book.title + " (Edited)" })
                        }
                      >
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteBook(book.id)} className="text-destructive">
                        Delete Book
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
};

export default Books;
