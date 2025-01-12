import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { toast } from "sonner";
import { useEffect } from "react";

export function useStorefront(storefrontId: string | undefined | null) {
  // First check if we have a session
  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Session check error:", error);
      return null;
    }
    return session;
  };

  return useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      console.log("Fetching storefront data for ID:", storefrontId);
      
      if (!storefrontId) {
        console.log("No storefront ID provided");
        return null;
      }

      try {
        // Check session before proceeding
        const session = await checkSession();
        if (!session) {
          console.log("No active session found");
          toast.error("Please log in to access this content");
          throw new Error("Authentication required");
        }

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
    retry: (failureCount, error) => {
      // Only retry if it's a network error and not an auth error
      if (error instanceof Error && error.message === "Authentication required") {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 0, // Always fetch fresh data
    enabled: !!storefrontId, // Only run query if storefrontId exists
  });
}