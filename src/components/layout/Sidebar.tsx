
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Book, BarChart3, Users, Clock, FileQuestion, Wrench, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={cn(
      "h-screen bg-sidebar flex flex-col fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center p-4">
        <div className={cn(
          "bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-3",
          collapsed && "mr-0"
        )}>
          B
        </div>
        {!collapsed && <h1 className="text-sidebar-foreground text-xl font-bold">Bibliomane</h1>}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-8 px-2">
        <nav className="space-y-1">
          <NavLink to="/" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
            <BarChart3 className="sidebar-icon" />
            {!collapsed && <span>Overview</span>}
          </NavLink>
          
          <NavLink to="/books" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
            <Book className="sidebar-icon" />
            {!collapsed && <span>Books</span>}
          </NavLink>
          
          {isAdmin && (
            <NavLink to="/users" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
              <Users className="sidebar-icon" />
              {!collapsed && <span>Users</span>}
            </NavLink>
          )}
          
          <NavLink to="/borrowed" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
            <Clock className="sidebar-icon" />
            {!collapsed && <span>Borrowed books</span>}
          </NavLink>
          
          <NavLink to="/requested" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
            <FileQuestion className="sidebar-icon" />
            {!collapsed && <span>Requested books</span>}
          </NavLink>
          
          <NavLink to="/settings" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
            <Wrench className="sidebar-icon" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
          
          <NavLink to="/help" className={({ isActive }) => cn("sidebar-link", isActive && "active")}>
            <HelpCircle className="sidebar-icon" />
            {!collapsed && <span>Help</span>}
          </NavLink>
        </nav>
      </div>
      
      {/* User info and logout */}
      <div className="p-4 border-t border-sidebar-border">
        {collapsed ? (
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} 
            className="w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary">
            <span className="sr-only">Expand sidebar</span>
            {"<"}
          </Button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar>
                <AvatarFallback>{user ? getInitials(user.name) : "?"}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{user?.role}</p>
              </div>
            </div>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} 
                className="text-sidebar-foreground hover:bg-sidebar-accent w-8 h-8">
                {">"}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout} 
                className="text-sidebar-foreground hover:bg-sidebar-accent w-8 h-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
