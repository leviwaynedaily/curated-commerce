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
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)

      if (error) throw error

      toast.success("Product deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.")
    }
  }

  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={handleDelete}
        className="h-8 w-8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}