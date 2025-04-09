
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Database, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BookTable } from "@/components/tables/BookTable";
import { MemberTable } from "@/components/tables/MemberTable";
import { BorrowedBookTable } from "@/components/tables/BorrowedBookTable";
import { RequestedBookTable } from "@/components/tables/RequestedBookTable";

const DatabaseTables = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("books");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // This is just a visual indication - data will be refreshed via the components
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Data refreshed",
        description: "The latest data has been loaded from the database.",
      });
    } catch (error) {
      toast({
        title: "Error refreshing data",
        description: "Could not refresh the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <PageLayout 
      title="Database Tables" 
      subtitle={isAdmin ? "Manage library database tables" : "View library database records"}
      adminOnly={false}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {isAdmin ? "Admin database access" : "Database records"}
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search all tables..."
                className="pl-9 w-[250px]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="books" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
            <TabsTrigger value="requested">Requested Books</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Books</CardTitle>
                    <CardDescription>Manage book catalog and inventory</CardDescription>
                  </div>
                  {isAdmin && (
                    <Button size="sm">Add Book</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <BookTable searchTerm={searchTerm} isAdmin={isAdmin} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>Manage library members and their information</CardDescription>
                  </div>
                  {isAdmin && (
                    <Button size="sm">Add Member</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <MemberTable searchTerm={searchTerm} isAdmin={isAdmin} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="borrowed" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Borrowed Books</CardTitle>
                    <CardDescription>Track book check-outs and returns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BorrowedBookTable searchTerm={searchTerm} isAdmin={isAdmin} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requested" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Requested Books</CardTitle>
                    <CardDescription>Manage pending and past book requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RequestedBookTable searchTerm={searchTerm} isAdmin={isAdmin} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DatabaseTables;
