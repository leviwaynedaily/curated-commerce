import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserQueries } from "@/hooks/useUserQueries";
import { StorefrontUsers } from "@/components/storefront/StorefrontUsers";

interface Storefront {
  id: string;
  name: string;
  storefront_users: {
    id: string;
    user_id: string;
    role: string;
    profiles: {
      email: string;
    };
  }[];
}

const Users = () => {
  const { business } = useUserQueries({});

  const { data: storefronts = [], isLoading } = useQuery({
    queryKey: ["storefronts-with-users", business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      console.log("Fetching storefronts with users for business:", business.id);

      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          id,
          name,
          storefront_users (
            id,
            user_id,
            role,
            user:profiles!user_id(
              email
            )
          )
        `)
        .eq("business_id", business.id);

      if (error) {
        console.error("Error fetching storefronts with users:", error);
        throw error;
      }

      // Transform the data to match the expected format
      const transformedData = data.map(storefront => ({
        ...storefront,
        storefront_users: storefront.storefront_users.map(user => ({
          id: user.id,
          user_id: user.user_id,
          role: user.role,
          profiles: {
            email: user.user.email
          }
        }))
      }));

      console.log("Fetched storefronts with users:", transformedData);
      return transformedData as Storefront[];
    },
    enabled: !!business?.id,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users across your storefronts
          </p>
        </div>

        {storefronts.map((storefront) => (
          <div key={storefront.id} className="space-y-4">
            <h2 className="text-2xl font-semibold">{storefront.name}</h2>
            <StorefrontUsers 
              storefrontId={storefront.id} 
              users={storefront.storefront_users} 
            />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Users;