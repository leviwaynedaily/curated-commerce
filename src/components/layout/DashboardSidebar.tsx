import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home,
  Settings,
  Package,
  Palette,
  Globe,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { StorefrontSwitcher } from "@/components/storefront/StorefrontSwitcher";

interface DashboardSidebarProps {
  open?: boolean;
  mobileOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onMobileOpenChange?: (open: boolean) => void;
}

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Products", icon: Package, url: "/products" },
  { title: "Stores", icon: Store, url: "/stores" },
  { title: "Appearance", icon: Palette, url: "/appearance" },
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "View Store", icon: Globe, url: "/preview" },
];

const DashboardSidebarContent = () => (
  <>
    <SidebarHeader className="h-16 flex items-center px-6 border-b">
      <span className="text-xl font-semibold text-primary">Curately</span>
    </SidebarHeader>
    <SidebarContent>
      <div className="px-4 py-2">
        <StorefrontSwitcher />
      </div>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </>
);

export function DashboardSidebar({ 
  open, 
  mobileOpen = false,
  onOpenChange,
  onMobileOpenChange 
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="p-0 w-[180px]">
          <DashboardSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block fixed left-0 top-0 z-20 h-full w-44 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-transform duration-300 ease-in-out lg:relative lg:transform-none",
          !open && "-translate-x-full"
        )}
      >
        <DashboardSidebarContent />
      </div>
    </>
  );
}