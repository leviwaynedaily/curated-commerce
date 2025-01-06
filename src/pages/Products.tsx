import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/products/ProductTable"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductBulkActions } from "@/components/products/ProductBulkActions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "@/components/forms/ProductForm"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RotateCw } from "lucide-react"
import { Loader2 } from "lucide-react"

// Extracted components to reduce file size
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex items-center gap-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p>Loading...</p>
    </div>
  </div>
);

const ErrorState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="space-y-4">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        There was an error loading the storefront. Please try refreshing the page.
      </AlertDescription>
    </Alert>
    <Button 
      variant="outline" 
      onClick={onRefresh}
      className="gap-2"
    >
      <RotateCw className="h-4 w-4" />
      Refresh Page
    </Button>
  </div>
);

const NoStorefrontSelected = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="text-center space-y-4">
    <h2 className="text-2xl font-bold">No storefront selected</h2>
    <p className="text-muted-foreground">
      Please select a storefront from the dropdown in the sidebar to manage its products.
    </p>
    <Button 
      variant="default"
      onClick={onNavigate}
    >
      Go to Stores
    </Button>
  </div>
);

const Products = () => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Get the current storefront ID from localStorage
  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  // First check authentication
  const { data: session, isLoading: isLoadingAuth } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("Checking authentication status...")
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Auth error:", error)
        throw error
      }
      console.log("Session status:", session ? "Authenticated" : "Not authenticated")
      return session
    },
    retry: 1,
  })

  // Effect to handle authentication and storefront changes
  useEffect(() => {
    if (!isLoadingAuth && !session) {
      console.log("No active session, redirecting to login")
      toast.error("Please login to access this page")
      navigate("/login")
      return
    }

    if (!currentStorefrontId) {
      console.log("No storefront selected, redirecting to stores page")
      toast.error("Please select a storefront first")
      navigate("/stores")
    } else {
      console.log("Current storefront ID:", currentStorefrontId)
      // Invalidate queries when storefront changes
      queryClient.invalidateQueries({ queryKey: ["storefront"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  }, [currentStorefrontId, navigate, queryClient, session, isLoadingAuth])

  const { data: storefront, isLoading: isStorefrontLoading, error: storefrontError } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      console.log("Fetching storefront data with ID:", currentStorefrontId)
      
      if (!currentStorefrontId || !session) {
        console.log("Missing storefront ID or session")
        return null
      }

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .maybeSingle()

      if (error) {
        console.error("Error fetching storefront:", error)
        throw error
      }

      console.log("Fetched storefront:", data)
      return data
    },
    enabled: !!currentStorefrontId && !!session,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })

  // Handle loading states
  if (isLoadingAuth || isStorefrontLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    )
  }

  // Handle authentication error
  if (!session) {
    return (
      <DashboardLayout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please login to access this page.
          </p>
          <Button 
            variant="default"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Handle storefront errors
  if (storefrontError) {
    console.error("Error loading storefront:", storefrontError)
    return (
      <DashboardLayout>
        <ErrorState onRefresh={() => window.location.reload()} />
      </DashboardLayout>
    )
  }

  if (!currentStorefrontId || !storefront) {
    return (
      <DashboardLayout>
        <NoStorefrontSelected onNavigate={() => navigate("/stores")} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-2">
              Manage your store's products here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Import</Button>
            <Button 
              variant="default"
              onClick={() => setShowCreateProduct(true)}
            >
              Add product
            </Button>
          </div>
        </div>

        <ProductFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ProductBulkActions
          selectedProducts={selectedProducts}
          onClearSelection={() => setSelectedProducts([])}
        />

        <ProductTable
          storefrontId={storefront.id}
          statusFilter={selectedStatus}
          searchQuery={searchQuery}
          selectedProducts={selectedProducts}
          onSelectedProductsChange={setSelectedProducts}
        />

        <Dialog open={showCreateProduct} onOpenChange={setShowCreateProduct}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              storefrontId={storefront.id}
              onSuccess={() => setShowCreateProduct(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default Products