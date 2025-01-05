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
import { Plus } from "lucide-react"
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

export function StorefrontSwitcher() {
  const [showCreateStore, setShowCreateStore] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
        console.error("Error fetching business:", error)
        throw error
      }

      return data
    },
  })

  const { data: storefronts, isLoading } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
      if (!business?.id) return []

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
      return data
    },
    enabled: !!business?.id,
  })

  // Get the current storefront ID from localStorage
  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  // Effect to validate current storefront
  useEffect(() => {
    if (storefronts && storefronts.length > 0 && !currentStorefrontId) {
      // If no storefront is selected but storefronts exist, select the first one
      const firstStorefront = storefronts[0]
      console.log("Auto-selecting first storefront:", firstStorefront.id)
      localStorage.setItem('lastStorefrontId', firstStorefront.id)
      // Invalidate queries to trigger refetch with new storefront
      queryClient.invalidateQueries()
      toast.success(`Selected storefront: ${firstStorefront.name}`)
    }
  }, [storefronts, currentStorefrontId, queryClient])

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
            // Invalidate all queries to refresh data for new storefront
            queryClient.invalidateQueries()
            // Force a refresh to update the dashboard with the new store
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