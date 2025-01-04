import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Globe, Link as LinkIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const DomainManagement = () => {
  const [subdomain, setSubdomain] = useState("");
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null;
      
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!currentStorefrontId,
  });

  const handleSubdomainSave = async () => {
    if (!currentStorefrontId) {
      toast.error("No storefront selected");
      return;
    }

    try {
      const { error } = await supabase
        .from("storefronts")
        .update({ custom_domain: `${subdomain}.curately.shop` })
        .eq("id", currentStorefrontId);

      if (error) throw error;

      toast.success("Subdomain updated successfully");
    } catch (error) {
      console.error("Error updating subdomain:", error);
      toast.error("Failed to update subdomain");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!storefront) {
    return (
      <DashboardLayout>
        <div>Please select a storefront first</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Domain Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure how customers access your storefront
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic URL</TabsTrigger>
            <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
            <TabsTrigger value="custom">Custom Domain</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic URL</CardTitle>
                <CardDescription>
                  Your storefront is automatically available at a basic URL using your store's slug
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono text-[#1A1F2C] break-all">
                    https://curately.shop/{storefront.slug}
                  </p>
                </div>
                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertTitle>Always Available</AlertTitle>
                  <AlertDescription>
                    This URL is always available, even if you set up a custom domain
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subdomain">
            <Card>
              <CardHeader>
                <CardTitle>Subdomain Setup</CardTitle>
                <CardDescription>
                  Create a professional subdomain on curately.shop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="your-store"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                  />
                  <span>.curately.shop</span>
                </div>
                <Button onClick={handleSubdomainSave}>Save Subdomain</Button>
                {storefront.custom_domain && (
                  <Alert>
                    <LinkIcon className="h-4 w-4" />
                    <AlertTitle>Current Subdomain</AlertTitle>
                    <AlertDescription>
                      Your storefront is available at: {storefront.custom_domain}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom Domain Setup</CardTitle>
                <CardDescription>
                  Use your own domain name with your storefront
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTitle>How to set up your custom domain</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>
                      To use your own domain (like www.yourstore.com), follow these steps:
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Set up your subdomain on the Subdomain tab first</li>
                      <li>
                        Add a CNAME record in your domain's DNS settings pointing to your subdomain:
                        <pre className="mt-2 p-2 bg-muted rounded">
                          CNAME www {storefront.custom_domain || "your-subdomain.curately.shop"}
                        </pre>
                      </li>
                      <li>
                        For the root domain (yourstore.com), add an A record or use your provider's
                        CNAME flattening feature
                      </li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DomainManagement;