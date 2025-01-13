import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { StorefrontSwitcher } from "../storefront/StorefrontSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserButton } from "@/components/auth/UserButton";

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: isActive("/dashboard"),
    },
    {
      name: "Stores",
      href: "/stores",
      icon: Store,
      current: isActive("/stores"),
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
      current: isActive("/products"),
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      current: isActive("/users"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: isActive("/settings"),
    },
  ];

  return (
    <div 
      className={cn(
        "relative h-full bg-[#161616] transition-all duration-300",
        isCollapsed ? "w-16" : "w-[240px]",
        className
      )}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center gap-2 border-b border-white/10 px-4">
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed ? "justify-center w-full" : ""
          )}>
            <div className="bg-white p-1 rounded-md">
              <img
                src="/lovable-uploads/982a241f-b82d-4f33-879d-d27bf029a82c.png"
                alt="Logo"
                className="h-8 w-auto"
              />
            </div>
            {!isCollapsed && (
              <span className="font-montserrat font-bold text-white text-xl">
                curately
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-2">
              <StorefrontSwitcher />
              <nav className="grid gap-1 px-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-white",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/10"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-2 p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserButton />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-white"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}