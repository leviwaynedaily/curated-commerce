import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Store, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
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
      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", session?.user?.id)
        .single();

      if (!business) return [];

      const { data: storefronts } = await supabase
        .from("storefronts")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      return storefronts || [];
    },
    enabled: !!session?.user?.id,
  });

  if (!session) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground mt-2">
              Manage your storefronts and create new ones.
            </p>
          </div>
          <Button onClick={() => navigate("/storefront-information")}>
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
                  <CardTitle>{store.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {store.is_published ? "Published" : "Draft"}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {store.description || "No description"}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/storefront-information?id=${store.id}`)}
                  >
                    Manage Store
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