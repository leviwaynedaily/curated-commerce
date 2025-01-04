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
  Users,
  MessageSquare,
  ShoppingBag,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Products", icon: Package, url: "/products" },
  { title: "Orders", icon: ShoppingBag, url: "/orders" },
  { title: "Customers", icon: Users, url: "/customers" },
  { title: "Messages", icon: MessageSquare, url: "/messages" },
  { title: "Appearance", icon: Palette, url: "/appearance" },
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "View Store", icon: Globe, url: "/preview" },
];

export function DashboardSidebar({ open, onOpenChange }: DashboardSidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-20 h-full w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-transform duration-300 ease-in-out lg:relative lg:transform-none",
        !open && "-translate-x-full"
      )}
    >
      <SidebarHeader className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-semibold text-primary">Curately</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}