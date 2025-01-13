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

  const businessUsersQuery = useQuery({
    queryKey: ["business-users", businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) return [];
      console.log("Fetching business users for business:", businessQuery.data.id);

      // First get business users
      const { data: businessUsers, error: businessUsersError } = await supabase
        .from("business_users")
        .select("id, role, user_id")
        .eq("business_id", businessQuery.data.id);

      if (businessUsersError) {
        console.error("Error fetching business users:", businessUsersError);
        throw businessUsersError;
      }

      // Then get the profiles for those users
      const userIds = businessUsers.map(user => user.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Combine the data
      const usersWithProfiles = businessUsers.map(user => ({
        ...user,
        profiles: profiles.find(profile => profile.id === user.user_id)
      }));

      console.log("Business users fetched:", usersWithProfiles);
      return usersWithProfiles;
    },
    enabled: !!businessQuery.data?.id,
  });

  return {
    user: userQuery.data,
    business: businessQuery.data,
    storefronts: storefrontsQuery.data,
    businessUsers: businessUsersQuery.data,
    refetchUser: userQuery.refetch,
    refetchBusinessUsers: businessUsersQuery.refetch,
  };
};