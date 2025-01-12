import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Store, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
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

  const { data: storefronts, isLoading } = useQuery({
    queryKey: ["storefronts"],
    queryFn: async () => {
      try {
        console.log("Fetching business for user:", session?.user?.id);
        const { data: business } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", session?.user?.id)
          .maybeSingle();

        if (!business) {
          console.log("No business found");
          return [];
        }

        console.log("Fetching storefronts for business:", business.id);
        const { data: storefronts, error } = await supabase
          .from("storefronts")
          .select(`
            *,
            products (count)
          `)
          .eq("business_id", business.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching storefronts:", error);
          toast.error("Failed to load storefronts");
          throw error;
        }

        console.log("Fetched storefronts:", storefronts);
        return storefronts || [];
      } catch (error) {
        console.error("Failed to fetch storefronts:", error);
        toast.error("Failed to load storefronts");
        throw error;
      }
    },
    enabled: !!session?.user?.id,
  });

  const getSetupProgress = (storefront) => {
    let progress = 0;
    const steps = [
      !!storefront.name,
      !!storefront.description,
      !!storefront.logo_url,
      !!storefront.products?.length,
      storefront.is_published
    ];
    
    progress = (steps.filter(Boolean).length / steps.length) * 100;
    return Math.round(progress);
  };

  const getStatusBadge = (storefront) => {
    if (storefront.is_published) {
      return <Badge className="bg-green-500">Published</Badge>;
    }
    const progress = getSetupProgress(storefront);
    if (progress === 100) {
      return <Badge className="bg-yellow-500">Ready to Publish</Badge>;
    }
    return <Badge variant="secondary">Draft</Badge>;
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Your Storefronts</h1>
          <p className="text-muted-foreground mt-2">
            Select a storefront to manage or create a new one.
          </p>
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
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Store className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create Your First Store</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first online storefront. It only takes a few minutes!
              </p>
              <Button onClick={() => navigate("/storefront-information")}>
                Create Store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storefronts?.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle>{store.name}</CardTitle>
                    {getStatusBadge(store)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {store.products?.length || 0} Products
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Setup Progress</span>
                        <span className="font-medium">{getSetupProgress(store)}%</span>
                      </div>
                      <Progress value={getSetupProgress(store)} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {store.description || "No description"}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        localStorage.setItem('lastStorefrontId', store.id);
                        navigate('/dashboard');
                      }}
                    >
                      Select Store
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}