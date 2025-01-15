import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');
  const isDashboardRoute = location.pathname === "/dashboard";

  const getPageInfo = () => {
    if (!currentStorefrontId) {
      return {
        title: "",
        description: ""
      };
    }

    const path = location.pathname.split("/")[1];
    const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    
    const descriptions: Record<string, string> = {
      "domain-management": "Configure how customers access your storefront",
      "appearance": "Customize how your storefront looks. Changes are saved automatically.",
      "products": "Manage your store's products here.",
      "pwa-settings": "Configure your Progressive Web App settings for mobile and desktop devices.",
      "storefront-information": "Customize how your storefront appears to customers. Changes are saved automatically."
    };

    return {
      title,
      description: descriptions[path] || ""
    };
  };

  const { title, description } = getPageInfo();

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden bg-background dark:bg-[#121212] text-foreground">
      {/* Desktop Sidebar - Only show when a storefront is selected */}
      {currentStorefrontId && (
        <div className="hidden md:block w-16 hover:w-[240px] transition-all duration-300">
          <div className="fixed left-0 top-0 h-full">
            <DashboardSidebar />
          </div>
        </div>
      )}

      {/* Mobile Sidebar - Only show when a storefront is selected */}
      {currentStorefrontId && (
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden fixed left-4 top-4 z-40"
              size="icon"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {!isDashboardRoute && <DashboardHeader title={title} description={description} />}
        <div className="px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}