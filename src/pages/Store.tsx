import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Dashboard as DashboardContent } from "@/components/dashboard/Dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useParams } from "react-router-dom"

export default function Store() {
  const { id } = useParams()
  console.log("Store page - Storefront ID:", id)

  const { data: storefront, isLoading, error } = useQuery({
    queryKey: ["storefront", id],
    queryFn: async () => {
      if (!id) return null

      try {
        // First try to get published storefronts (no auth needed)
        const { data: publicData, error: publicError } = await supabase
          .from("storefronts")
          .select("*")
          .eq("id", id)
          .eq("is_published", true)
          .single()

        if (publicData) {
          console.log("Found published storefront:", publicData.id)
          return publicData
        }

        // If not found or error, try authenticated query
        const { data: privateData, error: privateError } = await supabase
          .from("storefronts")
          .select("*")
          .eq("id", id)
          .single()

        if (privateError) {
          console.error("Error fetching storefront:", privateError)
          throw privateError
        }

        if (!privateData) {
          console.error("No storefront found with ID:", id)
          throw new Error("Storefront not found")
        }

        console.log("Found private storefront:", privateData.id)
        return privateData
      } catch (error) {
        console.error("Failed to fetch storefront:", error)
        throw error
      }
    },
    retry: 1,
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading storefront information...</div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading storefront information. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  if (!storefront) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Storefront not found. Please select a different storefront.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DashboardContent storefront={storefront} />
    </DashboardLayout>
  )
}