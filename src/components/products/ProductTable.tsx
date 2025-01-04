import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "./ProductActions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "../forms/ProductForm"

interface ProductTableProps {
  storefrontId: string
  statusFilter: string
  searchQuery: string
  selectedProducts: string[]
  onSelectedProductsChange: (products: string[]) => void
}

export function ProductTable({
  storefrontId,
  statusFilter,
  searchQuery,
  selectedProducts,
  onSelectedProductsChange,
}: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storefrontId, statusFilter, searchQuery],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId)
      let query = supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefrontId)
        .order("created_at", { ascending: false })

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      // Apply search filter
      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }

      console.log("Products fetched:", data)
      return data
    },
  })

  const toggleProductSelection = (productId: string) => {
    onSelectedProductsChange(
      selectedProducts.includes(productId)
        ? selectedProducts.filter(id => id !== productId)
        : [...selectedProducts, productId]
    )
  }

  const toggleAllProducts = () => {
    if (products) {
      onSelectedProductsChange(
        selectedProducts.length === products.length
          ? []
          : products.map(product => product.id)
      )
    }
  }

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (!products?.length) {
    return <div>No products found. Create your first product above!</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    products.length > 0 &&
                    selectedProducts.length === products.length
                  }
                  onCheckedChange={toggleAllProducts}
                />
              </TableHead>
              <TableHead className="min-w-[300px]">Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>In-Town Price</TableHead>
              <TableHead>Shipping Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <span>{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.status === "active" ? "default" : "secondary"}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>${product.in_town_price}</TableCell>
                <TableCell>${product.shipping_price}</TableCell>
                <TableCell>{product.category || "—"}</TableCell>
                <TableCell className="text-right">
                  <ProductActions
                    productId={product.id}
                    onEdit={() => setEditingProduct(product)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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