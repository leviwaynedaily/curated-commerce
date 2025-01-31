import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, RefreshCw, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StorefrontForm } from "@/components/forms/StorefrontForm"
import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function StorefrontSwitcher() {
  const [showCreateStore, setShowCreateStore] = useState(false)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

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
  const currentStorefront = storefronts?.find(store => store.id === currentStorefrontId)

  if (isLoadingBusiness || isLoadingStorefronts) {
    return (
      <div className="flex items-center gap-2 text-white">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    )
  }

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
          className="w-full gap-2 text-white bg-white/10 hover:bg-white/20"
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

  if (!storefronts?.length) {
    return (
      <>
        <Button
          variant="ghost"
          className="gap-2 -ml-2 text-white hover:text-white/90 hover:bg-white/10"
          onClick={() => setShowCreateStore(true)}
        >
          <Plus className="h-4 w-4" />
          Create Store
        </Button>

        <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
          <DialogContent className="bg-brand-green text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Create Store</DialogTitle>
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full -ml-2 h-auto p-2 text-base hover:bg-white/10 text-white hover:text-white/90 justify-between"
          >
            <span className="truncate">
              {currentStorefront?.name || "Select store"}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 bg-brand-green border-white/20">
          <div className="grid gap-1">
            {storefronts.map((store) => (
              <Button
                key={store.id}
                variant="ghost"
                className="w-full justify-start font-normal text-white hover:bg-white/10 hover:text-white/90"
                onClick={() => {
                  localStorage.setItem('lastStorefrontId', store.id)
                  queryClient.invalidateQueries()
                  setOpen(false)
                  window.location.reload()
                }}
              >
                {store.name || store.slug}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-normal text-white hover:bg-white/10 hover:text-white/90"
              onClick={() => {
                setShowCreateStore(true)
                setOpen(false)
              }}
            >
              <Plus className="h-4 w-4" />
              Create New Store
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showCreateStore} onOpenChange={setShowCreateStore}>
        <DialogContent className="bg-brand-green text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create Store</DialogTitle>
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
