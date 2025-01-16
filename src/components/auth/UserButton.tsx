import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserProfileDialog } from "./UserProfileDialog";
import { useUserQueries } from "@/hooks/useUserQueries";

export function UserButton() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [session, setSession] = useState(null);

  // Listen for auth state changes with better error handling
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          navigate('/login');
          return;
        }
        setSession(data.session);
      } catch (error) {
        console.error("Session initialization error:", error);
        navigate('/login');
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { user, storefronts, refetchUser } = useUserQueries(session);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    console.log("No session, returning null");
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white hover:bg-white/90"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-lg">
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        user={user}
        storefronts={storefronts || []}
        onProfileUpdate={refetchUser}
      />
    </>
  );
}