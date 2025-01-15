import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StoreGrid } from "@/components/dashboard/StoreGrid"
import { BusinessUserManagement } from "@/components/dashboard/BusinessUserManagement"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { Dashboard as StorefrontDashboard } from "@/components/dashboard/Dashboard"
import { Loader2, ArrowLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const { data: storefronts, refetch: refetchStorefronts } = useQuery({
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

  const { data: currentStorefront, isLoading: isLoadingStorefront } = useQuery({
    queryKey: ["current-storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null;
      console.log("Fetching current storefront:", currentStorefrontId);
      
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching current storefront:", error);
        return null;
      }

      return data;
    },
    enabled: !!currentStorefrontId,
  });

  const handleBackToStorefronts = () => {
    localStorage.removeItem('lastStorefrontId');
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to log out")
    }
  };

  if (!session) return null

  return (
    <DashboardLayout>
      <Helmet>
        <title>{currentStorefront ? `${currentStorefront.name} | Curately` : 'Storefronts | Curately'}</title>
      </Helmet>
      <div className="space-y-8">
        {!currentStorefront && (
          <div className="flex justify-between items-center px-4 md:px-8 py-4 border-b">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome to Your Digital Storefront
            </h1>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
        
        {isLoadingStorefront ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : currentStorefront ? (
          <div className="space-y-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleBackToStorefronts}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Storefronts
            </Button>
            <StorefrontDashboard storefront={currentStorefront} />
          </div>
        ) : (
          <div className="space-y-8">
            <StoreGrid 
              storefronts={storefronts || []} 
              business={business}
              refetchStorefronts={refetchStorefronts}
            />
            {business && (
              <BusinessUserManagement 
                business={business}
                businessUsers={[]} 
                onRefetch={() => {}}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}