import {
  Copy,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"

interface ProductBulkActionsProps {
  selectedProducts: string[]
  onClearSelection: () => void
}

export function ProductBulkActions({
  selectedProducts,
  onClearSelection,
}: ProductBulkActionsProps) {
  const queryClient = useQueryClient()

  const handleBulkDelete = async () => {
    try {
      // First, get all selected products to access their images
      const { data: products, error: fetchError } = await supabase
        .from("products")
        .select("images")
        .in("id", selectedProducts)

      if (fetchError) throw fetchError

      // Delete images from storage for all selected products
      const allImages = products?.flatMap(product => 
        (product.images || []).map((url: string) => {
          // Extract the path from the full URL
          const path = url.split("/storefront-assets/")[1]
          return path
        })
      )

      if (allImages?.length) {
        console.log("Deleting images from storage:", allImages)
        const { error: storageError } = await supabase.storage
          .from("storefront-assets")
          .remove(allImages)

        if (storageError) {
          console.error("Error deleting images from storage:", storageError)
          // Continue with product deletion even if image deletion fails
        }
      }

      // Delete the products
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .in("id", selectedProducts)

      if (deleteError) throw deleteError

      toast.success("Products deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClearSelection()
    } catch (error) {
      console.error("Error deleting products:", error)
      toast.error("Failed to delete products. Please try again.")
    }
  }

  const handleBulkDuplicate = async () => {
    try {
      console.log("Starting bulk duplication for products:", selectedProducts)
      
      // First, get the products to duplicate
      const { data: productsToDuplicate, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .in("id", selectedProducts)

      if (fetchError) throw fetchError
      if (!productsToDuplicate) {
        throw new Error("No products found to duplicate")
      }

      console.log("Products to duplicate:", productsToDuplicate)

      // Prepare the products for insertion by removing id and timestamps
      const duplicatedProducts = productsToDuplicate.map(product => ({
        storefront_id: product.storefront_id,
        name: `${product.name} (Copy)`,
        description: product.description,
        in_town_price: product.in_town_price,
        shipping_price: product.shipping_price,
        category: product.category,
        images: product.images,
        status: product.status,
        sort_order: product.sort_order,
      }))

      console.log("Prepared duplicated products:", duplicatedProducts)

      const { error: insertError } = await supabase
        .from("products")
        .insert(duplicatedProducts)

      if (insertError) throw insertError

      toast.success("Products duplicated successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClearSelection()
    } catch (error) {
      console.error("Error duplicating products:", error)
      toast.error("Failed to duplicate products. Please try again.")
    }
  }

  if (selectedProducts.length === 0) return null

  return (
    <div className="flex items-center gap-2 py-4">
      <span className="text-sm text-muted-foreground">
        {selectedProducts.length} items selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkDuplicate}
        className="ml-4"
      >
        <Copy className="mr-2 h-4 w-4" />
        Duplicate
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkDelete}
        className="text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  )
}