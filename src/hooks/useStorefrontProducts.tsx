import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  in_town_price: number | null;
  shipping_price: number | null;
  images: Json | null;
  category?: string | null;
  status: 'active' | 'inactive';
  sort_order: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  storefront_id?: string | null;
}

interface PageData {
  products: Product[];
  totalCount: number;
}

export function useStorefrontProducts(storefrontId: string) {
  console.log("Fetching products for storefront:", storefrontId);
  
  return useQuery<PageData>({
    queryKey: ["preview-products", storefrontId],
    queryFn: async () => {
      console.log("Fetching all products");
      
      const { data: products, error, count } = await supabase
        .from("products")
        .select("*", { count: 'exact' })
        .eq("storefront_id", storefrontId)
        .eq("status", "active")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log(`Fetched ${products?.length} products, total count:`, count);
      return {
        products: products as Product[] || [],
        totalCount: count || 0,
      };
    },
    enabled: !!storefrontId,
  });
}