import { LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserButton() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: user, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: storefronts } = useQuery({
    queryKey: ["storefronts", business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!business?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const defaultStoreId = formData.get("defaultStore") as string;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          default_storefront_id: defaultStoreId 
        }
      });

      if (error) throw error;

      // Update localStorage if the default store changed
      if (defaultStoreId) {
        localStorage.setItem('lastStorefrontId', defaultStoreId);
        // Refresh the page to load the new default store
        window.location.reload();
      }

      await refetch();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        user?.email || "",
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      toast({
        title: "Error",
        description: "There was an error sending the reset password email.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={user?.user_metadata?.full_name || ""}
                placeholder="Enter your full name"
              />
            </div>
            {storefronts && storefronts.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="defaultStore">Default Store</Label>
                <Select
                  name="defaultStore"
                  defaultValue={user?.user_metadata?.default_storefront_id || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default store" />
                  </SelectTrigger>
                  <SelectContent>
                    {storefronts.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetPassword}
                className="w-full"
              >
                Reset Password
              </Button>
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}