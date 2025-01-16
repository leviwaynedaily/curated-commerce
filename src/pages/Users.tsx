import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserQueries } from "@/hooks/useUserQueries";
import { StorefrontUsers } from "@/components/storefront/StorefrontUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StorefrontUser {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    email: string;
  };
}

interface Storefront {
  id: string;
  name: string;
  storefront_users: StorefrontUser[];
}

const Users = () => {
  const { business } = useUserQueries({});
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const { data: storefronts = [], isLoading } = useQuery({
    queryKey: ["storefronts-with-users", business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      console.log("Fetching storefronts with users for business:", business.id);

      // First get all storefronts and their users
      const { data: storefrontsData, error: storefrontsError } = await supabase
        .from("storefronts")
        .select(`
          id,
          name,
          storefront_users (
            id,
            user_id,
            role,
            profiles:profiles (
              email
            )
          )
        `)
        .eq("business_id", business.id);

      if (storefrontsError) {
        console.error("Error fetching storefronts:", storefrontsError);
        throw storefrontsError;
      }

      console.log("Fetched storefronts with users:", storefrontsData);
      return storefrontsData as Storefront[];
    },
    enabled: !!business?.id,
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsCreatingUser(true);
      console.log("Creating new user with email:", newUserEmail);

      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (error) throw error;

      toast.success("User created successfully! They will need to verify their email.");
      setNewUserEmail("");
      setNewUserPassword("");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user. Please try again.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users across your storefronts
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isCreatingUser}>
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>

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