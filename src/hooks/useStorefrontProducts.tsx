import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ITEMS_PER_PAGE = 16;

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

interface UseStorefrontProductsProps {
  storefrontId: string;
  selectedCategory?: string | null;
  searchQuery?: string;
  currentSort?: string;
}

export function useStorefrontProducts({ 
  storefrontId, 
  selectedCategory,
  searchQuery,
  currentSort = "newest"
}: UseStorefrontProductsProps) {
  console.log("Initializing useStorefrontProducts with ID:", storefrontId);
  console.log("Selected category:", selectedCategory);
  console.log("Search query:", searchQuery);
  console.log("Current sort:", currentSort);

  return useInfiniteQuery({
    queryKey: ["preview-products", storefrontId, selectedCategory, searchQuery, currentSort],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        console.log("Fetching products page:", pageParam);
        console.log("With category filter:", selectedCategory);
        console.log("With search query:", searchQuery);
        
        let query = supabase
          .from("products")
          .select("*", { count: "exact" })
          .eq("storefront_id", storefrontId)
          .eq("status", "active")
          .order("sort_order", { ascending: true })
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

        // Apply category filter if selected
        if (selectedCategory) {
          query = query.contains('category', [selectedCategory]);
        }

        // Apply search filter if provided
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        // Apply sorting
        switch (currentSort) {
          case "oldest":
            query = query.order('created_at', { ascending: true });
            break;
          case "price-desc":
            query = query.order('in_town_price', { ascending: false });
            break;
          case "price-asc":
            query = query.order('in_town_price', { ascending: true });
            break;
          default: // "newest"
            query = query.order('created_at', { ascending: false });
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
          nextPage: products?.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
          totalCount: count || 0
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