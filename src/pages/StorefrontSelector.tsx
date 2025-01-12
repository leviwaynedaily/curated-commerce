import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Store, ArrowRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function StorefrontSelector() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth session error:", error);
        toast.error("Authentication error. Please try logging in again.");
        navigate("/login");
        return;
      }
      if (!currentSession) {
        console.log("No active session, redirecting to login");
        navigate("/login");
        return;
      }
      console.log("Auth state changed:", "INITIAL_SESSION", currentSession.user.id);
      setSession(currentSession);
    };
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!currentSession) {
        console.log("Session ended, redirecting to login");
        navigate("/login");
      }
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: storefronts, isLoading } = useQuery({
    queryKey: ["storefronts"],
    queryFn: async () => {
      console.log("Fetching storefronts for selector");
      if (!session?.user?.id) {
        console.log("No session, returning null");
        return [];
      }

      try {
        const { data: business, error: businessError } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (businessError) {
          console.error("Error fetching business:", businessError);
          toast.error("Failed to load business data");
          return [];
        }

        if (!business) {
          console.log("No business found for user");
          return [];
        }

        console.log("Business data fetched:", business.id);

        const { data: storefronts, error } = await supabase
          .from("storefronts")
          .select("*")
          .eq("business_id", business.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching storefronts:", error);
          toast.error("Failed to load storefronts");
          return [];
        }

        console.log("Fetched storefronts:", storefronts?.length);
        return storefronts || [];
      } catch (error) {
        console.error("Error in storefronts query:", error);
        toast.error("An error occurred while loading your storefronts");
        return [];
      }
    },
    enabled: !!session?.user?.id,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "Authentication required") {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  if (!session) return null;

  const handleStorefrontSelect = (storefrontId: string) => {
    localStorage.setItem('lastStorefrontId', storefrontId);
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Select a Storefront</h1>
            <p className="text-muted-foreground mt-2">
              Choose a storefront to manage or create a new one.
            </p>
          </div>
          <Button onClick={() => navigate("/storefront-information")} className="hover:scale-105 transition-transform">
            <Plus className="mr-2 h-4 w-4" />
            Create Store
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-[100px] bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : storefronts?.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Get Started with Your First Store
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Store className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create Your First Storefront</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start your journey by creating your first online storefront. It only takes a few minutes to set up!
              </p>
              <Button onClick={() => navigate("/storefront-information")} size="lg" className="animate-pulse">
                Create Your First Store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storefronts?.map((store) => (
              <Card 
                key={store.id} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={() => handleStorefrontSelect(store.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{store.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      store.is_published 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {store.is_published ? "Published" : "Draft"}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {store.description || "No description"}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    Select Store
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}