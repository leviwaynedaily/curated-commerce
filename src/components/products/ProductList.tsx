import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "../forms/ProductForm"
import { ProductActions } from "./ProductActions"

export function ProductList({ storefrontId }: { storefrontId: string }) {
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storefrontId],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefrontId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }

      console.log("Products fetched:", data)
      return data
    },
  })

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (!products?.length) {
    return <div>No products found. Create your first product above!</div>
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="group relative hover:shadow-lg transition-shadow">
            {product.images?.[0] && (
              <div className="relative aspect-video">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
                <ProductActions
                  productId={product.id}
                  onEdit={() => setEditingProduct(product)}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <p>In-Town: ${product.in_town_price}</p>
                  <p>Shipping: ${product.shipping_price}</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {product.description || "No description"}
              </p>
              {product.category && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Category: {product.category}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              storefrontId={storefrontId}
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}