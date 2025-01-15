import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  FileText,
  Palette,
  Globe,
  Settings,
  LayoutDashboard,
  Monitor,
  Globe2,
  Eye
} from "lucide-react"
import { StorefrontSwitcher } from "../storefront/StorefrontSwitcher"

export function DashboardSidebar() {
  const location = useLocation()
  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  return (
    <div className="h-screen border-r flex flex-col">
      <div className="p-4 pb-2">
        <StorefrontSwitcher />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          {currentStorefrontId && (
            <div className="px-3 py-2">
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/products" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/products">
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/storefront-information" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/storefront-information">
                    <FileText className="mr-2 h-4 w-4" />
                    Storefront Information
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/appearance" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/appearance">
                    <Palette className="mr-2 h-4 w-4" />
                    Appearance
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/pwa-settings" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/pwa-settings">
                    <Monitor className="mr-2 h-4 w-4" />
                    PWA Settings
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/domain-management" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/domain-management">
                    <Globe2 className="mr-2 h-4 w-4" />
                    Domain Management
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/preview" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/preview">
                    <Eye className="mr-2 h-4 w-4" />
                    Live Preview
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <Separator className="mx-3" />

          <div className="px-3 py-2">
            <div className="space-y-1">
              {currentStorefrontId && (
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === "/dashboard" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === "/settings" && "bg-accent text-accent-foreground"
                )}
              >
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}