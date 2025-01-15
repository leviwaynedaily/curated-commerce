import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Dashboard as DashboardContent } from "@/components/dashboard/Dashboard"
import { StoreGrid } from "@/components/dashboard/StoreGrid"
import { BusinessUserManagement } from "@/components/dashboard/BusinessUserManagement"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Dashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) {
        navigate("/login")
        return
      }
      setSession(currentSession)
    }
    
    checkAuth()
  }, [navigate])

  const { data: business } = useQuery({
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
    enabled: !!session,
  })

  const { data: storefronts } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
      if (!business?.id) return []
      console.log("Fetching storefronts for business:", business.id)
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .order("name")

      if (error) throw error
      console.log("Storefronts fetched:", data?.length)
      return data
    },
    enabled: !!business?.id,
  })

  const { data: businessUsers, refetch: refetchBusinessUsers } = useQuery({
    queryKey: ["business-users", business?.id],
    queryFn: async () => {
      if (!business?.id) return []
      console.log("Fetching business users for business:", business.id)

      const { data: businessUsers, error: businessUsersError } = await supabase
        .from("business_users")
        .select("id, role, user_id")
        .eq("business_id", business.id)

      if (businessUsersError) throw businessUsersError

      const userIds = businessUsers.map(user => user.user_id)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds)

      if (profilesError) throw profilesError

      const usersWithProfiles = businessUsers.map(user => ({
        ...user,
        profiles: profiles.find(profile => profile.id === user.user_id)
      }))

      console.log("Business users fetched:", usersWithProfiles)
      return usersWithProfiles
    },
    enabled: !!business?.id,
  })

  const { data: storefront, isLoading, error } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .single()

      if (error) {
        console.error("Error fetching storefront:", error)
        throw error
      }

      return data
    },
    enabled: !!currentStorefrontId && !!session,
  })

  const handleStoreSelect = (storeId: string) => {
    window.location.reload()
  }

  if (!session) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {!currentStorefrontId ? (
          <div className="max-w-[1400px] mx-auto space-y-8">
            <StoreGrid 
              storefronts={storefronts || []} 
              business={business}
              onStoreSelect={handleStoreSelect}
            />

            {business && (
              <BusinessUserManagement 
                business={business}
                businessUsers={businessUsers || []}
                onRefetch={refetchBusinessUsers}
              />
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <div>Loading storefront information...</div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error loading storefront information. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            ) : storefront ? (
              <DashboardContent storefront={storefront} />
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Storefront not found. Please select a different storefront.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}