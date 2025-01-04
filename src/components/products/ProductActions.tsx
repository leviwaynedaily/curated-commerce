import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"

interface ProductActionsProps {
  productId: string
  onEdit: () => void
}

export function ProductActions({ productId, onEdit }: ProductActionsProps) {
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    try {
      // First, get the product to access its images
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("images")
        .eq("id", productId)
        .single()

      if (fetchError) throw fetchError

      // Delete images from storage if they exist
      if (product?.images?.length) {
        console.log("Deleting images from storage:", product.images)
        const { error: storageError } = await supabase.storage
          .from("storefront-assets")
          .remove(product.images.map((url: string) => {
            // Extract the path from the full URL
            const path = url.split("/storefront-assets/")[1]
            return path
          }))

        if (storageError) {
          console.error("Error deleting images from storage:", storageError)
          // Continue with product deletion even if image deletion fails
        }
      }

      // Delete the product
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)

      if (deleteError) throw deleteError

      toast.success("Product deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.")
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}