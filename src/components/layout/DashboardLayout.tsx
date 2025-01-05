import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserButton } from "@/components/auth/UserButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-52">
            <DashboardSidebar
              mobileOpen={mobileSidebarOpen}
              onMobileOpenChange={setMobileSidebarOpen}
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <header className="h-16 border-b flex items-center gap-4 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <UserButton />
            </div>
          </header>

          <main className="p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}