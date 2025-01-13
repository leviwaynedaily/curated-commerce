import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StorefrontUsers } from "@/components/storefront/StorefrontUsers";
import { useUserQueries } from "@/hooks/useUserQueries";
import { useSession } from "@supabase/auth-helpers-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserButton } from "@/components/auth/UserButton";
import { Lock, User } from "lucide-react";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Stats } from "@/components/dashboard/Stats";

const Landing = () => {
  const session = useSession();
  const { storefronts } = useUserQueries(session);
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: allUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      console.log("Fetching all users");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("email");

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Fetched users:", data);
      return data;
    },
  });

  const { data: users = [] } = useQuery({
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
          user:user_id(profiles!id(email))
        `)
        .eq("storefront_id", currentStorefrontId);

      if (error) {
        console.error("Error fetching storefront users:", error);
        throw error;
      }

      const transformedData = data.map(user => ({
        id: user.id,
        user_id: user.user_id,
        role: user.role,
        profiles: {
          email: user.user?.profiles?.email
        }
      }));

      console.log("Fetched storefront users:", transformedData);
      return transformedData;
    },
    enabled: !!currentStorefrontId,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="h-16 border-b flex items-center gap-2 px-3 sm:px-4 w-full">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 shrink-0 text-primary" />
          <span className="text-xl font-semibold">Curately</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </header>

      {/* Main content */}
      <main className="p-3 sm:p-4 w-full">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Storefront Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your storefronts and users
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Stats />
          </div>

          <QuickActions />

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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No storefronts found. Create your first storefront to get started.</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <h2 className="text-xl font-semibold">All Users</h2>
            </div>
            <div className="rounded-lg border">
              <div className="p-4">
                <div className="divide-y">
                  {allUsers.map((user) => (
                    <div key={user.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <StorefrontUsers storefrontId={currentStorefrontId} users={users} />
        </div>
      </main>
    </div>
  );
};

export default Landing;