import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessForm } from "@/components/forms/BusinessForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate()

  const { data: business, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log("No authenticated user found")
        return null
      }

      console.log("Fetching business for user:", user.id)
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Business query error:", error)
        return null
      }
      
      console.log("Business data fetched:", data)
      return data
    },
  })

  const { data: storefront, isLoading: isLoadingStorefront } = useQuery({
    queryKey: ["storefront", business?.id],
    queryFn: async () => {
      if (!business?.id) {
        console.log("No business ID available, skipping storefront fetch")
        return null
      }

      // First try to get the last accessed storefront from localStorage
      const lastStorefrontId = localStorage.getItem('lastStorefrontId')
      
      let query = supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)

      if (lastStorefrontId) {
        // If we have a last accessed storefront, try to get that one
        const { data: specificStorefront, error: specificError } = await query
          .eq('id', lastStorefrontId)
          .maybeSingle()
        
        if (specificError) {
          console.error("Error fetching specific storefront:", specificError)
        }
        
        if (specificStorefront) {
          console.log("Using last accessed storefront:", specificStorefront.id)
          // Navigate to the store page with the selected storefront
          navigate(`/store/${specificStorefront.id}`)
          return specificStorefront
        }
      }

      // If no last storefront or it wasn't found, get the first one
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("Storefront query error:", error)
        return null
      }

      // Store the storefront ID for next time and navigate if found
      if (data) {
        localStorage.setItem('lastStorefrontId', data.id)
        console.log("Setting new current storefront:", data.id)
        navigate(`/store/${data.id}`)
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