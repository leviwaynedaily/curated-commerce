import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserQueries } from "@/hooks/useUserQueries";
import { BusinessUserManagement } from "@/components/dashboard/BusinessUserManagement";
import { Card } from "@/components/ui/card";

const Users = () => {
  const { business } = useUserQueries({});

  const { data: businessUsers = [], refetch } = useQuery({
    queryKey: ["business-users", business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      console.log("Fetching business users for business:", business.id);

      const { data, error } = await supabase
        .from("business_users")
        .select(`
          id,
          role,
          user_id,
          profiles!business_users_user_id_fkey (
            id,
            email
          )
        `)
        .eq("business_id", business.id);

      if (error) {
        console.error("Error fetching business users:", error);
        throw error;
      }

      console.log("Business users fetched:", data);
      return data;
    },
    enabled: !!business?.id,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users across your business
          </p>
        </div>

        <Card className="p-6">
          <BusinessUserManagement 
            business={business} 
            businessUsers={businessUsers}
            onRefetch={refetch}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;