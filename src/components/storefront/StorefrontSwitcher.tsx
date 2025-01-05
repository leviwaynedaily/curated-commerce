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
import { Plus, Loader2 } from "lucide-react"
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

  // First check authentication and get business data
  const { data: business, isLoading: isLoadingBusiness, error: businessError } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      console.log("Checking authentication and fetching business data");
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!user) {
        console.log("No authenticated user found");
        navigate("/login");
        return null;
      }

      console.log("Fetching business for user:", user.id);
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching business:", error)
        throw error
      }

      console.log("Fetched business data:", data);
      return data
    },
    retry: 1
  })

  // Then fetch storefronts only if we have business data
  const { data: storefronts, isLoading: isLoadingStorefronts, error: storefrontsError } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
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
    },
    enabled: !!business?.id,
    retry: 2
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

  // Show error state
  if (businessError || storefrontsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load storefronts. Please refresh the page.
        </AlertDescription>
      </Alert>
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