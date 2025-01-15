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
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Query to get the current storefront
  const { data: storefront, refetch: refetchStorefront } = useQuery({
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

  const handleBackToDashboard = () => {
    localStorage.removeItem('lastStorefrontId');
    refetchStorefront();
    navigate('/dashboard');
  };

  const mainRoutes = [
    {
      label: 'Back to Storefronts',
      icon: ArrowLeft,
      onClick: handleBackToDashboard,
      active: location.pathname === '/dashboard',
      alwaysEnabled: true,
      showOnlyInStore: true,
    },
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: location.pathname === '/dashboard',
      alwaysEnabled: true,
      showOnlyInStore: false,
    },
  ];

  const storefrontRoutes = [
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

  const isInStore = location.pathname.startsWith('/store/') || !!storefront;

  return (
    <>
      <div 
        className={cn(
          "relative h-full bg-brand-green border-r border-brand-peach/20 transition-all duration-300",
          isCollapsed ? "w-16" : "w-[240px]",
          className
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="space-y-4 py-4 flex flex-col h-full">
          {/* Logo section - now clickable */}
          <button 
            onClick={handleBackToDashboard}
            className={cn(
              "px-3 py-2 flex items-center hover:bg-white/10 rounded-md transition-colors",
              isCollapsed ? "justify-center" : "justify-start gap-3"
            )}
          >
            <div className="rounded-md p-1">
              <img 
                src="/lovable-uploads/676a7b0a-3b60-49d7-bee1-49a8b896e630.png" 
                alt="Curately Logo" 
                className="h-8 w-auto"
              />
            </div>
            {!isCollapsed && (
              <span className="font-montserrat font-bold text-white text-xl">
                curately
              </span>
            )}
          </button>

          {/* Current Store Display */}
          {storefront && !isCollapsed && (
            <div className="px-3 py-2">
              <div className="text-sm text-white/70 font-open-sans">Current Store:</div>
              <div className="text-white font-medium truncate font-montserrat">
                {storefront.name}
              </div>
            </div>
          )}

          {/* Main navigation */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {/* Dashboard Section */}
              {mainRoutes
                .filter(route => !route.showOnlyInStore || isInStore)
                .map((route) => (
                <Button
                  key={route.href || route.label}
                  variant={route.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-colors border-b border-brand-peach/10",
                    route.active && "bg-white/10 hover:bg-white/20 text-white",
                    isCollapsed && "justify-center px-2",
                    !route.active && "hover:bg-white/10 text-white hover:text-white"
                  )}
                  onClick={route.onClick}
                  asChild={!route.onClick}
                >
                  {route.onClick ? (
                    <div className={cn(
                      "flex items-center w-full cursor-pointer",
                      isCollapsed ? "justify-center" : ""
                    )}>
                      <route.icon className={cn(
                        "shrink-0 text-white",
                        isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                      )} />
                      {!isCollapsed && <span className="truncate text-white font-open-sans">{route.label}</span>}
                    </div>
                  ) : (
                    <Link to={route.href} className={cn(
                      "flex items-center w-full",
                      isCollapsed ? "justify-center" : ""
                    )}>
                      <route.icon className={cn(
                        "shrink-0 text-white",
                        isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                      )} />
                      {!isCollapsed && <span className="truncate text-white font-open-sans">{route.label}</span>}
                    </Link>
                  )}
                </Button>
              ))}

              {/* Separator */}
              {!isCollapsed && (
                <Separator className="my-4 bg-white/20" />
              )}
              {isCollapsed && (
                <div className="my-4" />
              )}

              {/* Storefront Routes */}
              {storefrontRoutes.map((route) => (
                <Button
                  key={route.href}
                  variant={route.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-colors border-b border-brand-peach/10",
                    route.active && "bg-white/10 hover:bg-white/20 text-white",
                    isCollapsed && "justify-center px-2",
                    !route.active && "hover:bg-white/10 text-white hover:text-white",
                    !storefront && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!storefront}
                  onClick={route.onClick}
                  asChild={!route.onClick}
                >
                  {route.onClick ? (
                    <div className={cn(
                      "flex items-center w-full",
                      isCollapsed ? "justify-center" : ""
                    )}>
                      <route.icon className={cn(
                        "shrink-0 text-white",
                        isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                      )} />
                      {!isCollapsed && <span className="truncate text-white font-open-sans">{route.label}</span>}
                    </div>
                  ) : (
                    <Link to={route.href} className={cn(
                      "flex items-center w-full",
                      isCollapsed ? "justify-center" : ""
                    )}>
                      <route.icon className={cn(
                        "shrink-0 text-white",
                        isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
                      )} />
                      {!isCollapsed && <span className="truncate text-white font-open-sans">{route.label}</span>}
                    </Link>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Settings button */}
          <div className="px-3 py-2 mt-auto">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start transition-colors border-b border-brand-peach/10",
                "hover:bg-white/10 text-white hover:text-white",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className={cn(
                "shrink-0 text-white",
                isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"
              )} />
              {!isCollapsed && <span className="truncate text-white font-open-sans">Settings</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-brand-green text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white font-montserrat">Store Management</h3>
              <StorefrontSwitcher />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white font-montserrat">User Management</h3>
              <Link 
                to="/users" 
                className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-white/10 font-open-sans"
                onClick={() => setIsSettingsOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}