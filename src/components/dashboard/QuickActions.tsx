import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Palette, Globe } from "lucide-react"
import { Link } from "react-router-dom"

export function QuickActions() {
  return (
    <Card className="hover-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/products">
            <Package className="mr-2 h-4 w-4" />
            Manage Products
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Palette className="mr-2 h-4 w-4" />
          Customize Store
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Globe className="mr-2 h-4 w-4" />
          View Store
        </Button>
      </CardContent>
    </Card>
  )
}