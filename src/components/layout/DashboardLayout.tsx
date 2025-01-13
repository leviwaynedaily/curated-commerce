import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Menu, Lock } from "lucide-react";
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
          
          {/* Curately branding with Link */}
          <Link to="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Lock className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-xl font-semibold">Curately</span>
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