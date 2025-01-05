import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StorefrontSwitcher } from "@/components/storefront/StorefrontSwitcher";
import { UserButton } from "@/components/auth/UserButton";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package2,
  FileText,
  Eye,
  AppWindow,
  Globe
} from "lucide-react";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  mobileOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onMobileOpenChange?: (open: boolean) => void;
}

export function DashboardSidebar({ 
  className,
  open,
  mobileOpen,
  onOpenChange,
  onMobileOpenChange 
}: DashboardSidebarProps) {
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
      label: 'Live Preview',
      icon: Eye,
      href: '/preview',
      active: location.pathname === '/preview',
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
  ];

  return (
    <div className={cn("w-64 h-screen fixed left-0 top-0 bg-background border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-2">
            <StorefrontSwitcher />
          </div>
          <div className="mb-2">
            <UserButton />
          </div>
        </div>
        <div className="px-3 py-2">
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
        </div>
      </div>
    </div>
  );
}