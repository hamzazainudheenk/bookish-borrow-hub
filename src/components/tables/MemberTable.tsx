
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapDbMemberToUser } from "@/lib/supabase-mappers";
import { User } from "@/types";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MoreHorizontal, Trash, Users } from "lucide-react";

interface MemberTableProps {
  searchTerm: string;
  isAdmin: boolean;
}

export const MemberTable = ({ searchTerm, isAdmin }: MemberTableProps) => {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Sample members in case database fetch fails
  const sampleMembers: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data: dbMembers, error } = await supabase
          .from("members")
          .select("*");

        if (error) {
          throw error;
        }

        if (dbMembers && dbMembers.length > 0) {
          const mappedMembers = dbMembers.map(dbMember => mapDbMemberToUser(dbMember));
          setMembers(mappedMembers);
        } else {
          // Fallback to sample data if no database results
          setMembers(sampleMembers);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        // Fallback to sample data if there's an error
        setMembers(sampleMembers);
        toast({
          title: "Failed to fetch members",
          description: "Using sample data instead",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMember = (id: string) => {
    // Implement edit functionality
    toast({
      title: "Edit member",
      description: `Editing member with ID: ${id}`,
    });
  };

  const handleDeleteMember = (id: string) => {
    // Implement delete functionality
    toast({
      title: "Delete member",
      description: `Deleting member with ID: ${id}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No members found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "There are no members in the database yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined Date</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(" ").map(part => part[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{member.name}</div>
                </div>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Badge variant={member.role === "admin" ? "default" : "outline"}>
                  {member.role === "admin" ? "Administrator" : "User"}
                </Badge>
              </TableCell>
              <TableCell>
                {/* Using a placeholder date since joinedAt is not in the User type */}
                {new Date().toLocaleDateString()}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
