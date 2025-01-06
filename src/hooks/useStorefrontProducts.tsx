import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ITEMS_PER_PAGE = 25;

interface Product {
  id: string;
  name: string;
  description?: string;
  in_town_price?: number;
  shipping_price?: number;
  images?: string[];
  category?: string;
  sort_order?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  storefront_id?: string;
}

interface PageData {
  products: Product[];
  nextPage: number | undefined;
}

export function useStorefrontProducts(storefrontId: string) {
  console.log("Initializing useStorefrontProducts with ID:", storefrontId);

  return useInfiniteQuery<PageData>({
    queryKey: ["preview-products", storefrontId],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      console.log("Fetching products page:", pageParam);
      const start = Number(pageParam) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data: products, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("storefront_id", storefrontId)
        .eq("status", "active")
        .order("sort_order", { ascending: true })
        .range(start, end);

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log(`Fetched ${products?.length} products, total count:`, count);
      
      const hasNextPage = products && products.length === ITEMS_PER_PAGE;
      return {
        products: products as Product[] || [],
        nextPage: hasNextPage ? Number(pageParam) + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!storefrontId,
  });
}