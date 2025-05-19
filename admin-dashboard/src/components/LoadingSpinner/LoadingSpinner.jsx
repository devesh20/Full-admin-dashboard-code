// src/components/LoadingSpinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional, for combining classes

const LoadingSpinner = ({ className }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className={cn("h-20 w-20 animate-spin text-muted-foreground", className)} />
    </div>
  );
};

export default LoadingSpinner;
