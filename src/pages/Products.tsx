import { useState, useEffect, useRef } from "react"
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
import { AlertCircle, RotateCw, Download, Upload } from "lucide-react"
import { Loader2 } from "lucide-react"
import { generateTemplate, exportProducts, parseAndValidateCSV } from "@/utils/csvUtils"

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
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)

  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

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
    staleTime: 1000 * 60 * 5,
  })

  if (isLoadingAuth || isStorefrontLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    )
  }

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

  const handleExport = async () => {
    try {
      if (!currentStorefrontId) {
        toast.error("No storefront selected")
        return
      }

      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", currentStorefrontId)

      if (error) throw error

      exportProducts(products)
      toast.success("Products exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Failed to export products")
    }
  }

  const handleDownloadTemplate = () => {
    const csv = generateTemplate()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "products_template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentStorefrontId) return

    try {
      setIsImporting(true)
      const validProducts = await parseAndValidateCSV(file)

      if (validProducts.length === 0) {
        toast.error("No valid products found in CSV")
        return
      }

      const productsToInsert = validProducts.map(product => ({
        ...product,
        storefront_id: currentStorefrontId
      }))

      const { error } = await supabase
        .from("products")
        .insert(productsToInsert)

      if (error) throw error

      toast.success(`Successfully imported ${validProducts.length} products`)
      queryClient.invalidateQueries({ queryKey: ["products"] })
    } catch (error) {
      console.error("Import error:", error)
      toast.error("Failed to import products")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <ProductFilters
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="flex items-center gap-2"
                >
                  {isImporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Template
              </Button>
            </div>
            <Button 
              variant="default"
              onClick={() => setShowCreateProduct(true)}
            >
              Add product
            </Button>
          </div>
        </div>

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
