import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "../forms/ProductForm"
import { ProductTableHeader } from "./ProductTableHeader"
import { ProductTableRow } from "./ProductTableRow"

interface ProductTableProps {
  storefrontId: string
  statusFilter: string
  searchQuery: string
  selectedProducts: string[]
  onSelectedProductsChange: (products: string[]) => void
}

interface EditableCell {
  productId: string
  field: string
}

interface SortConfig {
  field: string
  direction: 'asc' | 'desc' | null
}

export function ProductTable({
  storefrontId,
  statusFilter,
  searchQuery,
  selectedProducts,
  onSelectedProductsChange,
}: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'created_at', direction: 'desc' })
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storefrontId, statusFilter, searchQuery, sortConfig],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId)
      let query = supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefrontId)

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`)
      }

      if (sortConfig.direction) {
        query = query.order(sortConfig.field, { ascending: sortConfig.direction === 'asc' })
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

  const handleCellClick = (productId: string, field: string) => {
    if (field === "status" || field === "images" || field === "created_at") return
    setEditingCell({ productId, field })
  }

  const handleCellUpdate = async (productId: string, field: string, value: string) => {
    try {
      const numericFields = ["in_town_price", "shipping_price"]
      const updateValue = numericFields.includes(field) ? Number(value) : value

      const { error } = await supabase
        .from("products")
        .update({ [field]: updateValue })
        .eq("id", productId)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated successfully!")
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setEditingCell(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, productId: string, field: string, value: string) => {
    if (e.key === "Enter") {
      handleCellUpdate(productId, field, value)
    } else if (e.key === "Escape") {
      setEditingCell(null)
    }
  }

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction:
        current.field === field
          ? current.direction === 'asc'
            ? 'desc'
            : 'asc'
          : 'desc'
    }))
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
              <TableHeader className="w-12">
                <Checkbox
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onCheckedChange={toggleAllProducts}
                />
              </TableHeader>
              <ProductTableHeader
                field="name"
                label="Product"
                className="min-w-[300px]"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="description"
                label="Description"
                className="min-w-[200px]"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="status"
                label="Status"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="in_town_price"
                label="In-Town Price"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="shipping_price"
                label="Shipping Price"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="category"
                label="Category"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="created_at"
                label="Created"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <ProductTableHeader
                field="actions"
                label="Actions"
                sortable={false}
                className="text-right"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <ProductTableRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onToggleSelect={toggleProductSelection}
                editingCell={editingCell}
                onCellClick={handleCellClick}
                onCellUpdate={handleCellUpdate}
                onKeyDown={handleKeyDown}
                onEdit={setEditingProduct}
              />
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