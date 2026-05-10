import { Toaster } from "@/components/ui/sonner";
import type React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster position="top-right" richColors />
    </div>
  );
}
