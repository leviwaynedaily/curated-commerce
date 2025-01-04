import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ProductList({ storefrontId }: { storefrontId: string }) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>${product.price}</CardDescription>
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
  )
}