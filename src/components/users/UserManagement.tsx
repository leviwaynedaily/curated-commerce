import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface StorefrontUser {
  id: string;
  user_id: string;
  role: string;
  auth_users: {
    email: string;
  };
}

interface Storefront {
  id: string;
  name: string;
  storefront_users: StorefrontUser[];
}

export function UserManagement({ storefronts }: { storefronts: Storefront[] }) {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleAddUser = async (storefrontId: string) => {
    try {
      setIsLoading(true);
      console.log("Adding user to storefront:", storefrontId);

      // First, check if the user exists
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      const user = users?.find(u => u.email === newUserEmail);

      if (!user) {
        toast.error("User not found. Please check the email address.");
        return;
      }

      // Check if user already has access
      const { data: existingAccess } = await supabase
        .from("storefront_users")
        .select("id")
        .eq("storefront_id", storefrontId)
        .eq("user_id", user.id)
        .single();

      if (existingAccess) {
        toast.error("User already has access to this storefront");
        return;
      }

      // Add user to storefront
      const { error } = await supabase
        .from("storefront_users")
        .insert({
          storefront_id: storefrontId,
          user_id: user.id,
          role: "member"
        });

      if (error) throw error;

      toast.success("User added successfully");
      setNewUserEmail("");
      queryClient.invalidateQueries({ queryKey: ["user-storefronts"] });
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (storefrontId: string, userId: string) => {
    try {
      setIsLoading(true);
      console.log("Removing user from storefront:", storefrontId);

      const { error } = await supabase
        .from("storefront_users")
        .delete()
        .eq("storefront_id", storefrontId)
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("User removed successfully");
      queryClient.invalidateQueries({ queryKey: ["user-storefronts"] });
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {storefronts.map((storefront) => (
        <Card key={storefront.id}>
          <CardHeader>
            <CardTitle>{storefront.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter user email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="max-w-md"
                />
                <Button
                  onClick={() => handleAddUser(storefront.id)}
                  disabled={isLoading || !newUserEmail}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="space-y-2">
                {storefront.storefront_users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded bg-muted"
                  >
                    <span>{user.auth_users.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(storefront.id, user.user_id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}