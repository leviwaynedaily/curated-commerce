import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StorefrontSwitcher } from "@/components/storefront/StorefrontSwitcher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Package2,
  FileText,
  Eye,
  AppWindow,
  Globe,
  Palette,
  Users,
  Store,
} from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Query to get the current storefront
  const { data: storefront } = useQuery({
    queryKey: ["current-storefront"],
    queryFn: async () => {
      const lastStorefrontId = localStorage.getItem('lastStorefrontId');
      if (!lastStorefrontId) return null;

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", lastStorefrontId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront:", error);
        return null;
      }

      return data;
    },
  });

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      label: 'Products',
      icon: Package2,
      href: '/products',
      active: location.pathname === '/products',
    },
    {
      label: 'Users',
      icon: Users,
      href: '/users',
      active: location.pathname === '/users',
    },
    {
      label: 'Storefront Information',
      icon: FileText,
      href: '/storefront-information',
      active: location.pathname === '/storefront-information',
    },
    {
      label: 'Appearance',
      icon: Palette,
      href: '/appearance',
      active: location.pathname === '/appearance',
    },
    {
      label: 'PWA Settings',
      icon: AppWindow,
      href: '/pwa-settings',
      active: location.pathname === '/pwa-settings',
    },
    {
      label: 'Domain Management',
      icon: Globe,
      href: '/domain-management',
      active: location.pathname === '/domain-management',
    },
    {
      label: 'Live Preview',
      icon: Eye,
      onClick: () => {
        if (storefront?.id) {
          navigate(`/preview?storefrontId=${storefront.id}`);
        }
      },
      href: '#',
      active: location.pathname === '/preview',
    },
  ];

  return (
    <div 
      className={cn(
        "relative h-full bg-[#212121] transition-all duration-300",
        isCollapsed ? "w-16" : "w-[240px]",
        className
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className={cn(
          "px-3 py-2 flex items-center justify-center",
          isCollapsed ? "justify-center" : "justify-center"
        )}>
          <img 
            src="/lovable-uploads/754b1fad-189d-4d77-8e89-3ddd6f651ba3.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-colors border-b border-[#33C3F0]/10",
                  route.active && "bg-primary hover:bg-primary text-primary-foreground",
                  isCollapsed && "justify-center px-2",
                  !route.active && "hover:bg-white/5 text-white/80 hover:text-white"
                )}
                onClick={route.onClick}
                asChild={!route.onClick}
              >
                {route.onClick ? (
                  <div className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "w-full"
                  )}>
                    <route.icon className={cn(
                      "shrink-0",
                      isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                    )} />
                    {!isCollapsed && <span className="truncate">{route.label}</span>}
                  </div>
                ) : (
                  <Link to={route.href} className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "w-full"
                  )}>
                    <route.icon className={cn(
                      "shrink-0",
                      isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                    )} />
                    {!isCollapsed && <span className="truncate">{route.label}</span>}
                  </Link>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="px-3 py-2 mt-auto">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "w-full"
          )}>
            <Store className={cn(
              "shrink-0 text-white/80",
              isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
            )} />
            <div className={cn(
              "transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
            )}>
              <StorefrontSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}