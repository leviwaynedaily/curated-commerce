import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function StorefrontSwitcher() {
  const [showCreateStore, setShowCreateStore] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // First check authentication
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session error:", error)
        return null
      }
      return session
    },
  })

  // Then fetch business data only if we have a session
  const { data: business, isLoading: isLoadingBusiness, error: businessError, refetch: refetchBusiness } = useQuery({
    queryKey: ["business", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null

      console.log("Fetching business for user:", session.user.id)
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching business:", error)
        throw error
      }

      return data
    },
    enabled: !!session?.user?.id,
  })

  const { data: storefronts, isLoading: isLoadingStorefronts, error: storefrontsError, refetch: refetchStorefronts } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
      try {
        if (!business?.id) {
          console.log("No business ID available");
          return [];
        }

        console.log("Fetching storefronts for business:", business.id);
        const { data, error } = await supabase
          .from("storefronts")
          .select("*")
          .eq("business_id", business.id)
          .order("name")

        if (error) {
          console.error("Error fetching storefronts:", error)
          throw error
        }

        console.log("Fetched storefronts:", data)
        return data || []
      } catch (error) {
        console.error("Failed to fetch storefronts:", error);
        throw error;
      }
    },
    enabled: !!business?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  })

  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  // Effect to validate current storefront
  useEffect(() => {
    if (storefronts && storefronts.length > 0 && !currentStorefrontId) {
      const firstStorefront = storefronts[0]
      console.log("Auto-selecting first storefront:", firstStorefront.id)
      localStorage.setItem('lastStorefrontId', firstStorefront.id)
      queryClient.invalidateQueries()
      toast.success(`Selected storefront: ${firstStorefront.name}`)
    }
  }, [storefronts, currentStorefrontId, queryClient])

  // Show loading state
  if (isLoadingBusiness || isLoadingStorefronts) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  // Show error state with retry button
  if (businessError || storefrontsError) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load data. Please try again.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => {
            refetchBusiness();
            refetchStorefronts();
            toast.info("Retrying to load data...");
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // Show create store button if no storefronts exist
  if (!storefronts?.length) {
    return (
      <>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowCreateStore(true)}
        >
          <Plus className="h-4 w-4" />
          Create Store
        </Button>

        <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Store</DialogTitle>
            </DialogHeader>
            {business && (
              <StorefrontForm
                businessId={business.id}
                onSuccess={() => {
                  setShowCreateStore(false)
                  queryClient.invalidateQueries({ queryKey: ["storefronts"] })
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Show storefront switcher
  return (
    <div>
      <Select
        value={currentStorefrontId || undefined}
        onValueChange={(value) => {
          if (value === "new") {
            setShowCreateStore(true)
          } else {
            console.log("Switching to storefront:", value)
            localStorage.setItem('lastStorefrontId', value)
            queryClient.invalidateQueries()
            window.location.reload()
          }
        }}
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Select store">
            {storefronts?.find(store => store.id === currentStorefrontId)?.name || "Select store"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background border z-[100]">
          {storefronts?.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              {store.name || store.slug}
            </SelectItem>
          ))}
          <SelectItem value="new" className="text-primary">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Store
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Store</DialogTitle>
          </DialogHeader>
          {business && (
            <StorefrontForm
              businessId={business.id}
              onSuccess={() => {
                setShowCreateStore(false)
                queryClient.invalidateQueries({ queryKey: ["storefronts"] })
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
