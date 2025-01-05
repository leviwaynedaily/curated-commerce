import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Palette, Globe } from "lucide-react"
import { Link } from "react-router-dom"

export function QuickActions() {
  // Get the current storefront ID from localStorage
  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  return (
    <Card className="hover-card">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 md:h-10 text-sm md:text-base" 
          asChild
        >
          <Link to="/products">
            <Package className="mr-2 h-4 w-4" />
            Manage Products
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 md:h-10 text-sm md:text-base"
          asChild
        >
          <Link to="/appearance">
            <Palette className="mr-2 h-4 w-4" />
            Customize Store
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 md:h-10 text-sm md:text-base"
          asChild
        >
          <a 
            href={`/preview?storefrontId=${currentStorefrontId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="mr-2 h-4 w-4" />
            View Store
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}