import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Users as UsersIcon } from "lucide-react";
import { UserManagement } from "@/components/users/UserManagement";

export default function Users() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        navigate("/login");
        return;
      }
      setSession(currentSession);
    };
    
    checkAuth();
  }, [navigate]);

  const { data: storefronts, isLoading, error } = useQuery({
    queryKey: ["user-storefronts"],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!business) return [];

      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          id,
          name,
          storefront_users (
            id,
            user_id,
            role,
            auth_users:user_id (
              email
            )
          )
        `)
        .eq("business_id", business.id);

      if (error) {
        console.error("Error fetching storefronts:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  if (!session) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading user information...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading user information. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage user access to your storefronts
          </p>
        </div>

        <UserManagement storefronts={storefronts || []} />
      </div>
    </DashboardLayout>
  );
}