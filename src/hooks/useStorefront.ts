import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { toast } from "sonner";

export function useStorefront(identifier: string | undefined | null) {
  return useQuery({
    queryKey: ["storefront", identifier],
    queryFn: async () => {
      console.log("Fetching storefront data for identifier:", identifier);
      
      if (!identifier) {
        console.log("No identifier provided");
        return null;
      }

      try {
        // First try to find by slug since it's more common for public access
        let query = supabase
          .from("storefronts")
          .select("*");

        // Check if the identifier is a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(identifier)) {
          console.log("Looking up storefront by ID");
          query = query.eq("id", identifier);
        } else {
          console.log("Looking up storefront by slug");
          query = query.eq("slug", identifier);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error("Error fetching storefront:", error);
          toast.error("Failed to load storefront data");
          throw error;
        }

        if (!data) {
          console.error("No storefront found with identifier:", identifier);
          toast.error("Storefront not found");
          throw new Error("Storefront not found");
        }

        console.log("Successfully fetched storefront data:", data);
        return data as PreviewData;
      } catch (error) {
        console.error("Failed to fetch storefront:", error);
        toast.error("Failed to load storefront data. Please try refreshing the page.");
        throw error;
      }
    },
    retry: 1,
    staleTime: 0,
    enabled: !!identifier,
  });
}