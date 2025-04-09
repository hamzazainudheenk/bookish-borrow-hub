
import { ReadingHistory } from "@/types";

// Mock data for reading history
const mockReadingHistory: Record<string, ReadingHistory[]> = {
  "1": [
    {
      id: "1",
      userId: "1",
      bookId: "1",
      startDate: "2023-01-15",
      finishDate: "2023-01-28",
      rating: 4,
      review: "Excellent book with great characters!",
      book: {
        id: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780446310789",
        category: "Fiction",
        publishedYear: 1960,
        availableCopies: 3,
        totalCopies: 5,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop"
      }
    },
    {
      id: "2",
      userId: "1",
      bookId: "2",
      startDate: "2023-02-10",
      finishDate: undefined,
      rating: undefined,
      review: undefined,
      book: {
        id: "2",
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        category: "Dystopian",
        publishedYear: 1949,
        availableCopies: 2,
        totalCopies: 4,
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1888&auto=format&fit=crop"
      }
    }
  ],
  "2": [
    {
      id: "3",
      userId: "2",
      bookId: "3",
      startDate: "2023-03-05",
      finishDate: "2023-03-20",
      rating: 5,
      review: "One of my all-time favorites!",
      book: {
        id: "3",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Fiction",
        publishedYear: 1925,
        availableCopies: 1,
        totalCopies: 3,
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop"
      }
    }
  ]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch reading history for a user
export const fetchReadingHistory = async (userId: string): Promise<ReadingHistory[]> => {
  await delay(800); // Simulate network delay
  return mockReadingHistory[userId] || [];
};

// Add a review to a history entry
export const addReviewToHistory = async (
  historyId: string, 
  review: string, 
  rating: number
): Promise<ReadingHistory> => {
  await delay(500); // Simulate network delay
  
  // Find the history entry
  let updatedHistory: ReadingHistory | undefined;
  
  Object.keys(mockReadingHistory).forEach(userId => {
    const userHistory = mockReadingHistory[userId];
    const historyIndex = userHistory.findIndex(h => h.id === historyId);
    
    if (historyIndex !== -1) {
      // Update the history entry
      mockReadingHistory[userId][historyIndex] = {
        ...mockReadingHistory[userId][historyIndex],
        rating,
        review,
        finishDate: new Date().toISOString().split("T")[0]
      };
      
      updatedHistory = mockReadingHistory[userId][historyIndex];
    }
  });
  
  if (!updatedHistory) {
    throw new Error("History entry not found");
  }
  
  return updatedHistory;
};
