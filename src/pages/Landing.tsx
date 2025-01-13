import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StorefrontUsers } from "@/components/storefront/StorefrontUsers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Landing = () => {
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["storefront-users", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return [];
      console.log("Fetching users for storefront:", currentStorefrontId);

      const { data, error } = await supabase
        .from("storefront_users")
        .select(`
          id,
          user_id,
          role,
          user:user_id(
            profiles!id(
              email
            )
          )
        `)
        .eq("storefront_id", currentStorefrontId);

      if (error) {
        console.error("Error fetching storefront users:", error);
        throw error;
      }

      // Transform the data to match the expected format
      const transformedData = data.map(user => ({
        id: user.id,
        user_id: user.user_id,
        role: user.role,
        profiles: {
          email: user.user.profiles.email
        }
      }));

      console.log("Fetched storefront users:", transformedData);
      return transformedData;
    },
    enabled: !!currentStorefrontId,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storefront Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your storefront settings and users
          </p>
        </div>

        <StorefrontUsers storefrontId={currentStorefrontId} users={users} />
      </div>
    </DashboardLayout>
  );
};

export default Landing;