import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/products/ProductTable"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductBulkActions } from "@/components/products/ProductBulkActions"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "@/components/forms/ProductForm"

const Products = () => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  // Get the current storefront ID from localStorage
  const currentStorefrontId = localStorage.getItem('lastStorefrontId')

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      console.log("Fetching storefront data with ID:", currentStorefrontId)
      
      if (!currentStorefrontId) {
        console.log("No storefront ID found in localStorage")
        return null
      }

      const { data: storefront, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .maybeSingle()

      if (error) {
        console.error("Error fetching storefront:", error)
        throw error
      }

      console.log("Fetched storefront:", storefront)
      return storefront
    },
    enabled: !!currentStorefrontId,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!currentStorefrontId || !storefront) {
    return (
      <DashboardLayout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No storefront selected</h2>
          <p className="text-muted-foreground">
            Please select a storefront from the dropdown in the sidebar to manage its products.
          </p>
        </div>
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