import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useUserQueries = (session: any) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        console.log("Fetching user data...");
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          throw error;
        }
        console.log("User data fetched:", user?.id);
        return user;
      } catch (error) {
        console.error("User query error:", error);
        throw error;
      }
    },
    enabled: !!session,
    retry: 1,
    meta: {
      errorHandler: () => {
        console.error("User query failed");
        toast({
          title: "Error",
          description: "Failed to load user data. Please try logging in again.",
          variant: "destructive",
        });
        // Handle logout
        supabase.auth.signOut().then(() => navigate("/login"));
      }
    }
  });

  const businessQuery = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      if (!userQuery.data?.id) return null;
      console.log("Fetching business data for user:", userQuery.data.id);
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userQuery.data.id)
        .single();

      if (error) throw error;
      console.log("Business data fetched:", data?.id);
      return data;
    },
    enabled: !!userQuery.data?.id,
  });

  const storefrontsQuery = useQuery({
    queryKey: ["storefronts", businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) return [];
      console.log("Fetching storefronts for business:", businessQuery.data.id);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", businessQuery.data.id)
        .order("name");

      if (error) throw error;
      console.log("Storefronts fetched:", data?.length);
      return data;
    },
    enabled: !!businessQuery.data?.id,
  });

  return {
    user: userQuery.data,
    business: businessQuery.data,
    storefronts: storefrontsQuery.data,
    refetchUser: userQuery.refetch,
  };
};