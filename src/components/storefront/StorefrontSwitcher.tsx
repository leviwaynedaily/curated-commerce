import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Store } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function StorefrontSwitcher() {
  const [showCreateStore, setShowCreateStore] = useState(false)
  const navigate = useNavigate()

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error("Error fetching business:", error)
        throw error
      }

      return data
    },
  })

  const { data: storefronts } = useQuery({
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

  const { data: currentStorefront } = useQuery({
    queryKey: ["storefront"],
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
                onSuccess={() => setShowCreateStore(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Store className="h-4 w-4 text-muted-foreground" />
      <Select
        defaultValue={currentStorefront?.id}
        onValueChange={(value) => {
          if (value === "new") {
            setShowCreateStore(true)
          } else {
            // Here you would typically update the current storefront in your app state
            console.log("Switching to storefront:", value)
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select store">
            {currentStorefront?.name || "Select store"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {storefronts.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              {store.name}
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
              onSuccess={() => setShowCreateStore(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}