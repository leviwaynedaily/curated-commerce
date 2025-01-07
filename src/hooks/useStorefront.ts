import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { toast } from "sonner";

export function useStorefront(storefrontId: string) {
  return useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      if (!storefrontId) {
        throw new Error("Store not found");
      }

      console.log("Fetching storefront data for ID:", storefrontId);
      
      try {
        const { data, error } = await supabase
          .from("storefronts")
          .select("*")
          .eq("id", storefrontId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching storefront:", error);
          throw new Error("Store not found");
        }

        if (!data) {
          console.error("No storefront found with ID:", storefrontId);
          throw new Error("Store not found");
        }

        console.log("Successfully fetched storefront data:", data);
        return data as PreviewData;
      } catch (error) {
        console.error("Failed to fetch storefront:", error);
        throw new Error("Store not found");
      }
    },
    retry: 1,
    enabled: !!storefrontId,
    staleTime: 0,
  });
}