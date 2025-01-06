import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 25;

export function useStorefrontProducts(storefrontId: string) {
  console.log("Setting up infinite products query for storefront:", storefrontId);
  
  return useInfiniteQuery({
    queryKey: ["preview-products", storefrontId],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("Fetching products page:", pageParam);
      const start = pageParam * ITEMS_PER_PAGE;
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

      console.log(`Fetched ${products?.length} products, total count:`, count);
      return {
        products: products || [],
        totalCount: count || 0,
        currentPage: pageParam,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const hasNextPage = lastPage.products.length === ITEMS_PER_PAGE;
      return hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    enabled: !!storefrontId,
  });
}