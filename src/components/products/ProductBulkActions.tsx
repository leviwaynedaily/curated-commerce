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
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", selectedProducts)

      if (error) throw error

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
      // First, get the products to duplicate
      const { data: productsToDuplicate, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .in("id", selectedProducts)

      if (fetchError) throw fetchError

      if (!productsToDuplicate) return

      // Prepare the products for insertion (removing ids and updating names)
      const duplicatedProducts = productsToDuplicate.map(product => ({
        ...product,
        id: undefined, // Let Supabase generate new IDs
        name: `${product.name} (Copy)`,
        created_at: undefined,
        updated_at: undefined,
      }))

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