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
} from "lucide-react";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

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
      href: '/',
      active: location.pathname === '/',
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
    <div className={cn("h-full bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {storefront?.logo_url && (
            <div className="mb-6 flex justify-center">
              <img 
                src={storefront.logo_url} 
                alt={storefront.name || 'Store logo'} 
                className="h-12 object-contain"
              />
            </div>
          )}
          <div className="mb-2">
            <StorefrontSwitcher />
          </div>
        </div>
        <ScrollArea className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={route.onClick}
                asChild={!route.onClick}
              >
                {route.onClick ? (
                  <div className="flex w-full items-center">
                    <route.icon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{route.label}</span>
                  </div>
                ) : (
                  <Link to={route.href} className="flex w-full items-center">
                    <route.icon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{route.label}</span>
                  </Link>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}