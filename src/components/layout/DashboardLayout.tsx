import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserButton } from "@/components/auth/UserButton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[240px] min-w-[240px] border-r">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b flex items-center gap-2 px-3 sm:px-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Updated branding with new logo and text */}
          <Link to="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/ac145c3c-5db2-4de7-89cd-43ff8840e998.png" 
              alt="Logo" 
              className="h-6 w-auto"
            />
            <img
              src="/lovable-uploads/cf59138a-3534-4915-91ab-d6dec06d2b4b.png"
              alt="Curately"
              className="h-5 w-auto"
            />
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>

        <main className="p-3 sm:p-4 w-full">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}