import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ITEMS_PER_PAGE = 1000; // Set to a large number to effectively load all products

interface Product {
  id: string;
  name: string;
  description?: string;
  in_town_price?: number;
  shipping_price?: number;
  images?: string[];
  category?: string[];
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

interface UseStorefrontProductsProps {
  storefrontId: string;
  selectedCategory?: string | null;
}

export function useStorefrontProducts({ storefrontId, selectedCategory }: UseStorefrontProductsProps) {
  console.log("Initializing useStorefrontProducts with ID:", storefrontId);
  console.log("Selected category:", selectedCategory);

  return useInfiniteQuery<PageData>({
    queryKey: ["preview-products", storefrontId, selectedCategory],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        console.log("Fetching all products");
        console.log("With category filter:", selectedCategory);
        
        let query = supabase
          .from("products")
          .select("*", { count: "exact" })
          .eq("storefront_id", storefrontId)
          .eq("status", "active")
          .order("sort_order", { ascending: true });

        if (selectedCategory) {
          query = query.contains('category', [selectedCategory]);
        }

        const { data: products, error, count } = await query;

        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products. Please try refreshing the page.");
          throw error;
        }

        console.log(`Fetched ${products?.length} products, total count:`, count);
        
        return {
          products: products as Product[] || [],
          nextPage: undefined, // No more pages since we're loading all at once
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