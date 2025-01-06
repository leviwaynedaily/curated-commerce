import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

const ITEMS_PER_PAGE = 25;

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
  nextPage: number | undefined;
}

export function useStorefrontProducts(storefrontId: string) {
  console.log("Setting up infinite products query for storefront:", storefrontId);
  
  return useInfiniteQuery<PageData>({
    queryKey: ["preview-products", storefrontId],
    initialPageParam: 0,
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
      
      const hasNextPage = products && products.length === ITEMS_PER_PAGE;
      return {
        products: products as Product[] || [],
        nextPage: hasNextPage ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!storefrontId,
  });
}