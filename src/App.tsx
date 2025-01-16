import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

// Create a client outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component
function App() {
  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing query cache");
        queryClient.clear();
        localStorage.removeItem('lastStorefrontId');
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log("Session token refreshed");
      }

      // Handle session expiration
      if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        toast.error("Session expired. Please sign in again.");
        queryClient.clear();
        window.location.href = '/login';
      }
    });

    // Attempt to refresh session on mount
    const refreshSession = async () => {
      try {
        console.log("Attempting to refresh session");
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Error refreshing session:", error);
          if (error.message.includes('session_not_found')) {
            toast.error("Session expired. Please sign in again.");
            queryClient.clear();
            window.location.href = '/login';
          }
        } else {
          console.log("Session refreshed successfully:", data.session?.user?.id);
        }
      } catch (err) {
        console.error("Unexpected error refreshing session:", err);
      }
    };

    refreshSession();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;