
import { ReadingHistory, Book } from "@/types";

// Mock books data
const mockBooks: Book[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Fiction",
    publishedYear: 1960,
    availableCopies: 3,
    totalCopies: 5,
    coverImage: "https://covers.openlibrary.org/b/id/8314555-L.jpg",
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice."
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Science Fiction",
    publishedYear: 1949,
    availableCopies: 2,
    totalCopies: 4,
    coverImage: "https://covers.openlibrary.org/b/id/8575741-L.jpg",
    description: "A dystopian novel set in a totalitarian society ruled by the Party."
  },
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    category: "Fiction",
    publishedYear: 1925,
    availableCopies: 1,
    totalCopies: 3,
    coverImage: "https://covers.openlibrary.org/b/id/8432047-L.jpg",
    description: "A portrait of the Jazz Age in all of its decadence and excess."
  }
];

// Mock reading history data
const mockReadingHistory: ReadingHistory[] = [
  {
    id: "1",
    userId: "user-1",
    bookId: "1",
    startDate: "2024-01-15",
    finishDate: "2024-02-01",
    rating: 5,
    review: "An absolute masterpiece that tackles complex social issues through a child's perspective.",
    book: mockBooks[0]
  },
  {
    id: "2",
    userId: "user-1",
    bookId: "2",
    startDate: "2024-02-10",
    finishDate: undefined,
    book: mockBooks[1]
  },
  {
    id: "3",
    userId: "user-1",
    bookId: "3",
    startDate: "2023-12-01",
    finishDate: "2023-12-20",
    rating: 4,
    review: "A beautifully written commentary on American society in the 1920s.",
    book: mockBooks[2]
  }
];

export const fetchReadingHistory = async (userId: string): Promise<ReadingHistory[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return filtered mock data based on userId
  return mockReadingHistory.filter(history => history.userId === userId);
};

export const addReviewToHistory = async (
  historyId: string, 
  review: string, 
  rating: number
): Promise<ReadingHistory> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const historyIndex = mockReadingHistory.findIndex(h => h.id === historyId);
  
  if (historyIndex === -1) {
    throw new Error("Reading history entry not found");
  }
  
  // Update the mock data
  const updatedHistory = {
    ...mockReadingHistory[historyIndex],
    review,
    rating,
    finishDate: new Date().toISOString().split("T")[0]
  };
  
  mockReadingHistory[historyIndex] = updatedHistory;
  
  return updatedHistory;
};
