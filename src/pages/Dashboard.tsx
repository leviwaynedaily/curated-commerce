import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StoreGrid } from "@/components/dashboard/StoreGrid"
import { BusinessUserManagement } from "@/components/dashboard/BusinessUserManagement"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BusinessForm } from "@/components/forms/BusinessForm"
import { UserButton } from "@/components/auth/UserButton"

export default function Dashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [showCreateBusiness, setShowCreateBusiness] = useState(false)

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

  const { data: business, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      console.log("Fetching business data for user:", user.id)
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

  const { data: storefronts, isLoading: isLoadingStorefronts } = useQuery({
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

  if (!session) return null

  if (isLoadingBusiness || isLoadingStorefronts) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!business) {
    return (
      <DashboardLayout>
        <Helmet>
          <title>Welcome | Curately</title>
        </Helmet>
        <div className="flex justify-end p-4">
          <UserButton />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 px-4">
          <img 
            src="/lovable-uploads/35d2c47a-30a1-48fb-8a09-a38f89a571d3.png" 
            alt="Welcome" 
            className="w-32 h-32 object-contain"
          />
          <div className="text-center space-y-2 max-w-md">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to Curately</h1>
            <p className="text-muted-foreground">
              To get started, create your business profile. This will allow you to manage your storefronts and products.
            </p>
          </div>
          <Button onClick={() => setShowCreateBusiness(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Business Profile
          </Button>
        </div>

        <Dialog open={showCreateBusiness} onOpenChange={setShowCreateBusiness}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Business Profile</DialogTitle>
            </DialogHeader>
            <BusinessForm onSuccess={() => {
              setShowCreateBusiness(false)
              window.location.reload()
            }} />
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Storefronts | Curately</title>
      </Helmet>
      <div className="flex justify-end p-4">
        <UserButton />
      </div>
      <div className="space-y-8">
        <div className="space-y-8">
          <StoreGrid 
            storefronts={storefronts || []} 
            business={business}
            onStoreSelect={(storeId) => navigate(`/store/${storeId}`)}
          />
          {business && (
            <BusinessUserManagement 
              business={business}
              businessUsers={businessUsers || []}
              onRefetch={refetchBusinessUsers}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}