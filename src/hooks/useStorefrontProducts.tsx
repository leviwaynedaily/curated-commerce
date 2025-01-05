import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 25;

export function useStorefrontProducts(storefrontId: string, page: number = 1) {
  console.log("Fetching products for page:", page);
  
  return useQuery({
    queryKey: ["preview-products", storefrontId, page],
    queryFn: async () => {
      console.log("Fetching products for preview", storefrontId);
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data: products, error, count } = await supabase
        .from("products")
        .select("*", { count: 'exact' })
        .eq("storefront_id", storefrontId)
        .eq("status", "active")
        .order("sort_order", { ascending: true })
        .range(start, end);

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Fetched products:", products);
      console.log("Total count:", count);

      return {
        products,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        currentPage: page
      };
    },
    enabled: !!storefrontId,
  });
}