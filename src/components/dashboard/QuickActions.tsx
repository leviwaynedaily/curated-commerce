import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Palette, Globe } from "lucide-react"
import { Link } from "react-router-dom"

export function QuickActions() {
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
        >
          <Palette className="mr-2 h-4 w-4" />
          Customize Store
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 md:h-10 text-sm md:text-base"
        >
          <Globe className="mr-2 h-4 w-4" />
          View Store
        </Button>
      </CardContent>
    </Card>
  )
}