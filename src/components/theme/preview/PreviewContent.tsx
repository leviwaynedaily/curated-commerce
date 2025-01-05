import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PreviewData } from "@/types/preview"
import { Badge } from "@/components/ui/badge"

interface PreviewContentProps {
  previewData: PreviewData
  colors: any
}

export function PreviewContent({ previewData, colors }: PreviewContentProps) {
  const { data: products } = useQuery({
    queryKey: ["preview-products", previewData.id],
    queryFn: async () => {
      console.log("Fetching products for preview")
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", previewData.id)
        .eq("status", "active")
        .order("sort_order", { ascending: true })

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }

      console.log("Fetched products:", data)
      return data
    },
    enabled: !!previewData.id
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {previewData.logo_url && (
        <img 
          src={previewData.logo_url} 
          alt={previewData.name} 
          className="h-16 object-contain mb-8"
        />
      )}
      
      {previewData.show_description && previewData.description && (
        <p 
          className="mb-8 text-lg"
          style={{ color: colors.font.secondary }}
        >
          {previewData.description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div 
            key={product.id}
            className="group relative rounded-lg overflow-hidden"
            style={{ backgroundColor: colors.background.secondary }}
          >
            {product.images?.[0] && (
              <div className="aspect-square relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex gap-2 flex-wrap mb-2">
                {product.category && (
                  <Badge
                    style={{
                      backgroundColor: colors.background.accent,
                      color: colors.font.primary
                    }}
                  >
                    {product.category}
                  </Badge>
                )}
              </div>
              <h3 
                className="font-semibold"
                style={{ color: colors.font.primary }}
              >
                {product.name}
              </h3>
              {product.description && (
                <p 
                  className="text-sm line-clamp-2"
                  style={{ color: colors.font.secondary }}
                >
                  {product.description}
                </p>
              )}
              <div 
                className="text-sm font-medium mt-2"
                style={{ color: colors.font.highlight }}
              >
                ${product.in_town_price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}