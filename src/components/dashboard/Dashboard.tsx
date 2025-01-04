import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Stats } from "./Stats"
import { QuickActions } from "./QuickActions"

export function Dashboard({ storefront }: { storefront: any }) {
  const { data: products } = useQuery({
    queryKey: ["products", storefront.id],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefront.id)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefront.id)
        // Removed the .eq("status", "active") filter to get all products

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }

      console.log("All products fetched:", data)
      return data
    },
    enabled: !!storefront?.id,
  })

  return (
    <div className="space-y-6 md:space-y-8 fade-in px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard for {storefront.name}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      <Stats products={products || []} />

      <div className="grid gap-4 md:grid-cols-2">
        <QuickActions />
      </div>
    </div>
  )
}