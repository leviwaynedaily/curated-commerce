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
        supabase.auth.signOut().then(() => navigate("/login"));
      }
    }
  });

  const businessQuery = useQuery({
    queryKey: ["business", userQuery.data?.id],
    queryFn: async () => {
      if (!userQuery.data?.id) {
        console.log("No user ID available, skipping business fetch");
        return null;
      }
      
      try {
        console.log("Fetching business data for user:", userQuery.data.id);
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", userQuery.data.id)
          .single();

        if (error) {
          console.error("Business query error:", error);
          throw error;
        }

        console.log("Business data fetched:", data?.id);
        return data;
      } catch (error) {
        console.error("Business query error:", error);
        throw error;
      }
    },
    enabled: !!userQuery.data?.id,
    retry: 1,
  });

  const storefrontsQuery = useQuery({
    queryKey: ["storefronts", businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) {
        console.log("No business ID available, skipping storefronts fetch");
        return [];
      }
      console.log("Fetching storefronts for business:", businessQuery.data.id);
      
      try {
        const { data, error } = await supabase
          .from("storefronts")
          .select("*")
          .eq("business_id", businessQuery.data.id)
          .order("name");

        if (error) {
          console.error("Storefronts query error:", error);
          throw error;
        }
        
        console.log("Storefronts fetched:", data?.length);
        return data || [];
      } catch (error) {
        console.error("Error fetching storefronts:", error);
        throw error;
      }
    },
    enabled: !!businessQuery.data?.id,
  });

  const businessUsersQuery = useQuery({
    queryKey: ["business-users", businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) {
        console.log("No business ID available, skipping business users fetch");
        return [];
      }
      console.log("Fetching business users for business:", businessQuery.data.id);

      try {
        const { data: businessUsers, error: businessUsersError } = await supabase
          .from("business_users")
          .select("id, role, user_id")
          .eq("business_id", businessQuery.data.id);

        if (businessUsersError) {
          console.error("Error fetching business users:", businessUsersError);
          throw businessUsersError;
        }

        const userIds = businessUsers.map(user => user.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }

        const usersWithProfiles = businessUsers.map(user => ({
          ...user,
          profiles: profiles.find(profile => profile.id === user.user_id)
        }));

        console.log("Business users fetched:", usersWithProfiles);
        return usersWithProfiles;
      } catch (error) {
        console.error("Error fetching business users:", error);
        throw error;
      }
    },
    enabled: !!businessQuery.data?.id,
  });

  return {
    user: userQuery.data,
    business: businessQuery.data,
    storefronts: storefrontsQuery.data,
    businessUsers: businessUsersQuery.data,
    isLoading: userQuery.isLoading || businessQuery.isLoading || storefrontsQuery.isLoading || businessUsersQuery.isLoading,
    error: userQuery.error || businessQuery.error || storefrontsQuery.error || businessUsersQuery.error,
    refetchUser: userQuery.refetch,
    refetchBusinessUsers: businessUsersQuery.refetch,
  };
};