
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Book as BookType } from "@/types";
import { useBooks } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import { Eye, Edit, Trash2, Plus, BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(1, "ISBN is required"),
  category: z.string().min(1, "Category is required"),
  publishedYear: z.coerce.number().min(1000, "Invalid year").max(new Date().getFullYear()),
  totalCopies: z.coerce.number().min(1, "At least 1 copy is required"),
  availableCopies: z.coerce.number().min(0, "Cannot be negative"),
  description: z.string().optional(),
  location: z.string().optional(),
  coverImage: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

const Books = () => {
  const { books, addBook, updateBook, deleteBook, borrowBook, requestBook, isLoading } = useBooks();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<"add" | "edit" | "view">("add");
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      category: "",
      publishedYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      description: "",
      location: "",
      coverImage: "",
    },
  });
  
  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = [...new Set(books.map(book => book.category))];
  
  const openAddDialog = () => {
    form.reset();
    setDialogType("add");
    setSelectedBook(null);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (book: BookType) => {
    form.reset({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      description: book.description || "",
      location: book.location || "",
      coverImage: book.coverImage || "",
    });
    setDialogType("edit");
    setSelectedBook(book);
    setIsDialogOpen(true);
  };
  
  const openViewDialog = (book: BookType) => {
    setDialogType("view");
    setSelectedBook(book);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (data: BookFormValues) => {
    try {
      if (dialogType === "add") {
        await addBook(data);
      } else if (dialogType === "edit" && selectedBook) {
        await updateBook(selectedBook.id, data);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };
  
  const handleBorrowRequest = async (book: BookType) => {
    try {
      if (book.availableCopies > 0) {
        await borrowBook(book.id);
      } else {
        await requestBook(book.id);
      }
    } catch (error) {
      console.error("Error borrowing/requesting book:", error);
    }
  };
  
  return (
    <PageLayout 
      title="Books" 
      subtitle="Manage your library collection"
      onSearch={query => setSearchTerm(query)}
    >
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedCategory && (
            <Badge variant="outline" className="px-3 py-1">
              {selectedCategory}
              <button
                className="ml-2 text-xs"
                onClick={() => setSelectedCategory(null)}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
        
        {isAdmin && (
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <Card key={book.id} className="overflow-hidden">
            <div className="relative aspect-[3/4] bg-muted">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-secondary">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge className="absolute top-2 right-2">
                {book.availableCopies} / {book.totalCopies}
              </Badge>
            </div>
            
            <CardHeader className="py-3">
              <CardTitle className="text-lg truncate">{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            
            <CardContent className="py-0">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{book.isbn}</span>
                <Badge variant="outline">{book.category}</Badge>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between py-3">
              <Button variant="ghost" size="sm" onClick={() => openViewDialog(book)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              <div className="space-x-1">
                {isAdmin && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(book)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => handleDelete(book.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                <Button 
                  variant={book.availableCopies > 0 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleBorrowRequest(book)}
                  disabled={isLoading}
                >
                  {book.availableCopies > 0 ? "Borrow" : "Request"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredBooks.length === 0 && (
        <div className="text-center py-10">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No books found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory 
              ? "Try changing your search or filters" 
              : "Start by adding books to your library"}
          </p>
        </div>
      )}
      
      {/* Book Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "add" 
                ? "Add New Book" 
                : dialogType === "edit" 
                  ? "Edit Book" 
                  : "Book Details"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "view" 
                ? "View book details" 
                : "Fill in the book information below"}
            </DialogDescription>
          </DialogHeader>
          
          {dialogType === "view" && selectedBook ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
                {selectedBook.coverImage ? (
                  <img
                    src={selectedBook.coverImage}
                    alt={`Cover of ${selectedBook.title}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                <p className="text-muted-foreground mb-4">{selectedBook.author}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-medium">{selectedBook.isbn}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{selectedBook.category}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span>{selectedBook.publishedYear}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Copies:</span>
                    <span>
                      {selectedBook.availableCopies} available / {selectedBook.totalCopies} total
                    </span>
                  </div>
                  
                  {selectedBook.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedBook.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBook.description || "No description available"}
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => handleBorrowRequest(selectedBook)}
                  disabled={isLoading}
                >
                  {selectedBook.availableCopies > 0 ? "Borrow Book" : "Request Book"}
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={dialogType === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={dialogType === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={dialogType === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={dialogType === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="publishedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Published Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            disabled={dialogType === "view"} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="totalCopies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Copies</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              disabled={dialogType === "view"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="availableCopies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              disabled={dialogType === "view"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={dialogType === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={dialogType === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4} 
                            disabled={dialogType === "view"} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {dialogType === "add" ? "Add Book" : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Books;
