
import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import React from "react";

interface CustomBadgeProps extends React.HTMLAttributes<HTMLDivElement>, 
  Omit<VariantProps<typeof badgeVariants>, 'variant'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "success";
}

export function CustomBadge({ 
  className, 
  variant = "default", 
  ...props 
}: CustomBadgeProps) {
  // Handle the custom "success" variant
  if (variant === "success") {
    return (
      <Badge 
        className={cn("bg-green-500 text-white hover:bg-green-600", className)} 
        {...props} 
      />
    );
  }
  
  // Forward to regular Badge for standard variants
  return <Badge variant={variant as any} className={className} {...props} />;
}
