import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ReadingHistory as ReadingHistoryType } from "@/types";
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
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, History as HistoryIcon, Star } from "lucide-react";
import { fetchReadingHistory, addReviewToHistory } from "@/services/mockReadingHistoryService";

const ReadingHistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHistory, setSelectedHistory] = useState<ReadingHistoryType | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    const getReadingHistory = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Use our mock service instead of Supabase
        const historyData = await fetchReadingHistory(user.id);
        setReadingHistory(historyData);
      } catch (error) {
        console.error("Error fetching reading history:", error);
        toast({
          title: "Error",
          description: "Failed to load reading history",
          variant: "destructive",
        });
        
        // Set empty array on error
        setReadingHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getReadingHistory();
  }, [user, toast]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const filteredHistory = readingHistory.filter(history => 
    history.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    history.book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReview = async () => {
    if (!selectedHistory) return;
    
    try {
      // Use our mock service instead of Supabase
      const updatedHistory = await addReviewToHistory(
        selectedHistory.id,
        review,
        rating
      );
      
      // Update local state
      setReadingHistory(prev => 
        prev.map(h => h.id === selectedHistory.id ? updatedHistory : h)
      );
      
      toast({
        title: "Review added",
        description: "Your review has been saved successfully",
      });
      
      setIsReviewDialogOpen(false);
      setReview("");
      setRating(0);
      setSelectedHistory(null);
      
    } catch (error) {
      console.error("Error adding review:", error);
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout 
      title="Reading History" 
      subtitle="Track your reading journey" 
      onSearch={handleSearch}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <HistoryIcon className="h-4 w-4" />
          <span>Your reading records</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
            <CardDescription>Books you've read or are currently reading</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-10">
                <Book className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No reading history found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? "Try a different search term" : "Your reading history will appear here once you've borrowed books"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Finished</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 overflow-hidden rounded bg-muted">
                              {history.book.coverImage ? (
                                <img 
                                  src={history.book.coverImage} 
                                  alt={history.book.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                  <Book className="h-4 w-4 text-secondary-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{history.book.title}</div>
                              <div className="text-sm text-muted-foreground">{history.book.author}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(history.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {history.finishDate ? (
                            new Date(history.finishDate).toLocaleDateString()
                          ) : (
                            <Badge variant="outline">Reading</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {history.rating ? (
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`h-4 w-4 ${i < history.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not rated</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {!history.rating && (
                            <Dialog open={isReviewDialogOpen && selectedHistory?.id === history.id} onOpenChange={(open) => {
                              setIsReviewDialogOpen(open);
                              if (!open) setSelectedHistory(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedHistory(history)}
                                >
                                  Add Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Review</DialogTitle>
                                  <DialogDescription>
                                    Share your thoughts about "{history.book.title}"
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="rating">Rating</Label>
                                    <Select 
                                      value={rating.toString()} 
                                      onValueChange={(value) => setRating(Number(value))}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a rating" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">★ Poor</SelectItem>
                                        <SelectItem value="2">★★ Fair</SelectItem>
                                        <SelectItem value="3">★★★ Average</SelectItem>
                                        <SelectItem value="4">★★★★ Good</SelectItem>
                                        <SelectItem value="5">★★★★★ Excellent</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="review">Review</Label>
                                    <Textarea
                                      id="review"
                                      value={review}
                                      onChange={(e) => setReview(e.target.value)}
                                      placeholder="Write your review here..."
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleAddReview}>Submit Review</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ReadingHistoryPage;
