import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/forms/ProductForm"
import { ProductList } from "@/components/products/ProductList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const Products = () => {
  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront"],
    queryFn: async () => {
      console.log("Fetching storefront data")
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!business) return null

      const { data: storefront } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .single()

      console.log("Fetched storefront:", storefront)
      return storefront
    },
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!storefront) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold">No storefront found</h2>
          <p className="text-muted-foreground mt-2">
            Please create a storefront first.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store's products here.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm storefrontId={storefront.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductList storefrontId={storefront.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Products