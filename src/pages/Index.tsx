import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessForm } from "@/components/forms/BusinessForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { Dashboard } from "@/components/dashboard/Dashboard"

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