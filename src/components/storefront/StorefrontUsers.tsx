import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StorefrontUser {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    email: string;
  };
}

interface StorefrontUsersProps {
  storefrontId: string | null;
  users: StorefrontUser[];
}

export function StorefrontUsers({ storefrontId, users }: StorefrontUsersProps) {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!storefrontId) {
    return (
      <Alert>
        <AlertDescription>
          Please select a storefront first
        </AlertDescription>
      </Alert>
    );
  }

  const handleAddUser = async () => {
    try {
      setIsLoading(true);
      console.log("Adding user to storefront:", storefrontId);

      // First, get the user's ID from their email using the profiles table
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUserEmail)
        .single();

      if (userError || !userData) {
        console.error("Error finding user:", userError);
        toast.error("User not found. Please check the email address.");
        return;
      }

      // Check if user already has access
      const { data: existingAccess } = await supabase
        .from("storefront_users")
        .select("id")
        .eq("storefront_id", storefrontId)
        .eq("user_id", userData.id)
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
          user_id: userData.id,
          role: "member"
        });

      if (error) throw error;

      toast.success("User added successfully");
      setNewUserEmail("");
      queryClient.invalidateQueries({ queryKey: ["storefront-users", storefrontId] });
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
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
      queryClient.invalidateQueries({ queryKey: ["storefront-users", storefrontId] });
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
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
              onClick={handleAddUser}
              disabled={isLoading || !newUserEmail}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded bg-muted"
              >
                <span>{user.profiles.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUser(user.user_id)}
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
  );
}