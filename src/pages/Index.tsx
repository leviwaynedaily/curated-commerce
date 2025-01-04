import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package,
  ArrowRight,
  Palette,
  Globe,
} from "lucide-react"
import { BusinessForm } from "@/components/forms/BusinessForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { Link } from "react-router-dom"

const stats = [
  {
    title: "Products",
    value: "123",
    icon: Package,
    change: "+3",
    changeType: "positive",
  },
]

const Dashboard = ({ storefront }: { storefront: any }) => (
  <div className="space-y-8 fade-in">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome back! Here's an overview of your store.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
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

      <Card className="hover-card">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No orders yet. They'll appear here when customers start purchasing.
          </p>
          <Button variant="link" className="mt-4 p-0 h-auto font-normal">
            View all orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
)

const Index = () => {
  const { data: business, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Business query error:", error)
        return null
      }
      
      return data
    },
  })

  const { data: storefront, isLoading: isLoadingStorefront } = useQuery({
    queryKey: ["storefront", business?.id],
    queryFn: async () => {
      if (!business?.id) return null

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .maybeSingle()

      if (error) {
        console.error("Storefront query error:", error)
        return null
      }
      
      return data
    },
    enabled: !!business?.id,
  })

  if (isLoadingBusiness || isLoadingStorefront) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {!business ? (
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessForm />
            </CardContent>
          </Card>
        </div>
      ) : !storefront ? (
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create Your Store</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set up your online storefront to start selling your products
              </p>
            </CardHeader>
            <CardContent>
              <StorefrontForm businessId={business.id} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Dashboard storefront={storefront} />
      )}
    </DashboardLayout>
  )
}

export default Index
