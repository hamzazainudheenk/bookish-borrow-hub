
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  requireAuth?: boolean;
  adminOnly?: boolean;
  onSearch?: (query: string) => void;
}

export const PageLayout = ({
  children,
  title,
  subtitle,
  requireAuth = true,
  adminOnly = false,
  onSearch,
}: PageLayoutProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title={title} subtitle={subtitle} onSearch={onSearch} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
