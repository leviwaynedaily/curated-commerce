import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StorefrontSwitcher } from "@/components/storefront/StorefrontSwitcher";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package2,
  FileText,
  Eye,
  AppWindow,
  Globe,
  Palette,
  Lock
} from "lucide-react";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const location = useLocation();

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
      href: '/preview',
      active: location.pathname === '/preview',
    },
  ];

  return (
    <div className={cn("h-full bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Curately
          </h1>
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
                asChild
              >
                <Link to={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}