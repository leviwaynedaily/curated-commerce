import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StorefrontUsers } from "@/components/storefront/StorefrontUsers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserQueries } from "@/hooks/useUserQueries";
import { useSession } from "@supabase/auth-helpers-react";

const Landing = () => {
  const session = useSession();
  const { storefronts } = useUserQueries(session);
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
          profiles:user_id(
            email
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
          email: user.profiles.email
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
            Manage your storefronts and users
          </p>
        </div>

        {storefronts && storefronts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {storefronts.map((storefront) => (
              <div
                key={storefront.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {storefront.name}
                  </h3>
                  {storefront.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {storefront.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No storefronts found. Create your first storefront to get started.</p>
          </div>
        )}

        <StorefrontUsers storefrontId={currentStorefrontId} users={users} />
      </div>
    </DashboardLayout>
  );
};

export default Landing;