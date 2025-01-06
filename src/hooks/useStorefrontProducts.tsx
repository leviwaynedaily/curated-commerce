import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ITEMS_PER_PAGE = 25;

interface Product {
  id: string;
  name: string;
  description?: string;
  in_town_price?: number;
  shipping_price?: number;
  images?: string[];
  category?: string[];  // Updated to string[] to match database schema
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
      try {
        console.log("Fetching products page:", pageParam);
        
        // First check if we have an authenticated session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log("No active session, proceeding with public access");
        }

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
          toast.error("Failed to load products. Please try refreshing the page.");
          throw error;
        }

        console.log(`Fetched ${products?.length} products, total count:`, count);
        
        const hasNextPage = products && products.length === ITEMS_PER_PAGE;
        return {
          products: products as Product[] || [],
          nextPage: hasNextPage ? Number(pageParam) + 1 : undefined,
        };
      } catch (error) {
        console.error("Error in products query:", error);
        toast.error("Failed to load products. Please try refreshing the page.");
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!storefrontId,
    retry: 1,
  });
}