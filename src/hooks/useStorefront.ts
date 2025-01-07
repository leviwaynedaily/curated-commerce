import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { toast } from "sonner";

export function useStorefront(storefrontId: string) {
  return useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      console.log("Fetching storefront data for ID:", storefrontId);
      
      try {
        const { data, error } = await supabase
          .from("storefronts")
          .select("*")
          .eq("id", storefrontId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching storefront:", error);
          toast.error("Failed to load storefront data");
          throw error;
        }

        if (!data) {
          console.error("No storefront found with ID:", storefrontId);
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
  });
}