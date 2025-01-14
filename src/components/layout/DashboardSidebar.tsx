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
  Settings,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const mainRoutes = [
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
        "relative h-full bg-brand-green dark:bg-brand-green border-r border-brand-peach dark:border-brand-peach transition-all duration-300",
        isCollapsed ? "w-16" : "w-[240px]",
        className
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="space-y-4 py-4 flex flex-col h-full">
        {/* Logo section */}
        <div className={cn(
          "px-3 py-2 flex items-center",
          isCollapsed ? "justify-center" : "justify-start gap-3"
        )}>
          <div className="rounded-md p-1 dark:bg-transparent">
            <img 
              src="/lovable-uploads/84642ac2-258f-4fbc-9f65-bb38ba4fae1f.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
          </div>
          {!isCollapsed && (
            <span className="font-montserrat font-bold text-white dark:text-white text-xl">
              curately
            </span>
          )}
        </div>

        {/* Main navigation */}
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-colors border-b border-brand-peach dark:border-brand-peach",
                  route.active && "bg-brand-peach/20 hover:bg-brand-peach/30 text-white",
                  isCollapsed && "justify-center px-2",
                  !route.active && "hover:bg-brand-peach/10 text-white dark:text-white hover:text-white dark:hover:text-white"
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
                      "shrink-0 text-white dark:text-white",
                      isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                    )} />
                    {!isCollapsed && <span className="truncate text-white dark:text-white">{route.label}</span>}
                  </div>
                ) : (
                  <Link to={route.href} className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "w-full"
                  )}>
                    <route.icon className={cn(
                      "shrink-0 text-white dark:text-white",
                      isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                    )} />
                    {!isCollapsed && <span className="truncate text-white dark:text-white">{route.label}</span>}
                  </Link>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Settings section */}
        <div className="px-3 py-2 mt-auto">
          <Collapsible
            open={!isCollapsed && isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-colors border-b border-brand-peach dark:border-brand-peach",
                  "hover:bg-brand-peach/10 text-white dark:text-white hover:text-white dark:hover:text-white",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Settings className={cn(
                  "shrink-0 text-white dark:text-white",
                  isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                )} />
                {!isCollapsed && <span className="truncate text-white dark:text-white">Settings</span>}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <Link to="/users" className={cn(
                "flex items-center px-2 py-1.5 text-sm text-white hover:bg-brand-peach/10 rounded-md",
                "transition-colors"
              )}>
                <Users className="h-4 w-4 mr-2" />
                User Management
              </Link>
              <div className="px-2">
                <StorefrontSwitcher />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}