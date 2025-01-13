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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

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
    <div className={cn(
      "relative h-full bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-[240px]",
      className
    )}>
      <div className="space-y-4 py-4">
        <div className={cn(
          "px-3 py-2 flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isCollapsed ? "justify-center w-full" : ""
          )}>
            <img 
              src="/lovable-uploads/f_logo_transparent.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            {!isCollapsed && (
              <img
                src="/lovable-uploads/f_text_transparent.png"
                alt="Curately"
                className="h-6 w-auto"
              />
            )}
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="px-3 py-2">
            <StorefrontSwitcher />
          </div>
        )}

        <ScrollArea className="px-3 py-2">
          <div className="space-y-1">
            <TooltipProvider delayDuration={0}>
              {routes.map((route) => (
                <Tooltip key={route.href}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={route.active ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start transition-colors",
                        route.active && "bg-primary hover:bg-primary text-primary-foreground",
                        isCollapsed && "justify-center px-2"
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
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {route.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </ScrollArea>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-2 h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}