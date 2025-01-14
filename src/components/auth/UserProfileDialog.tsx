import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme/ThemeProvider";

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  storefronts: any[];
  onProfileUpdate: () => void;
}

export function UserProfileDialog({ 
  isOpen, 
  onOpenChange, 
  user, 
  storefronts, 
  onProfileUpdate 
}: UserProfileDialogProps) {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const defaultStoreId = formData.get("defaultStore") as string;
    const selectedTheme = formData.get("theme") as "light" | "dark";
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          default_storefront_id: defaultStoreId,
          theme: selectedTheme
        }
      });

      if (error) throw error;

      setTheme(selectedTheme);

      if (defaultStoreId) {
        localStorage.setItem('lastStorefrontId', defaultStoreId);
        window.location.reload();
      }

      onProfileUpdate();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-brand-green text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              type="email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={user?.user_metadata?.full_name || ""}
              placeholder="Enter your full name"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-white">Theme</Label>
            <Select name="theme" defaultValue={theme}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {storefronts && storefronts.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="defaultStore" className="text-white">Default Store</Label>
              <Select
                name="defaultStore"
                defaultValue={user?.user_metadata?.default_storefront_id || ""}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Reset Password
            </Button>
          </div>
          <Button type="submit" className="w-full bg-white text-brand-green hover:bg-white/90">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}