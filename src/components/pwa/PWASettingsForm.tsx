import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PWABasicInfo } from "./PWABasicInfo";
import { PWAIcons } from "./PWAIcons";
import { PWAScreenshots } from "./PWAScreenshots";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pwaFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  short_name: z.string().min(2, "Short name must be at least 2 characters"),
  description: z.string().optional(),
  start_url: z.string().default("/"),
  display: z.enum(["standalone", "fullscreen", "minimal-ui", "browser"]).default("standalone"),
  orientation: z.enum(["portrait", "landscape", "any"]).default("any"),
  theme_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  icon_72x72: z.string().optional(),
  icon_96x96: z.string().optional(),
  icon_128x128: z.string().optional(),
  icon_144x144: z.string().optional(),
  icon_152x152: z.string().optional(),
  icon_192x192: z.string().optional(),
  icon_384x384: z.string().optional(),
  icon_512x512: z.string().optional(),
  screenshot_mobile: z.string().optional(),
  screenshot_desktop: z.string().optional(),
});

type PWAFormValues = z.infer<typeof pwaFormSchema>;

export function PWASettingsForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [manifestJson, setManifestJson] = useState<string | null>(null);
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: pwaSettings, isLoading } = useQuery({
    queryKey: ["pwa-settings", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null;
      
      const { data, error } = await supabase
        .from("pwa_settings")
        .select("*")
        .eq("storefront_id", currentStorefrontId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching PWA settings:", error);
        throw error;
      }

      return data;
    },
    enabled: !!currentStorefrontId,
  });

  const form = useForm<PWAFormValues>({
    resolver: zodResolver(pwaFormSchema),
    defaultValues: {
      name: "",
      short_name: "",
      description: "",
      start_url: "/",
      display: "standalone",
      orientation: "any",
      theme_color: "#000000",
      background_color: "#ffffff",
      ...pwaSettings,
    },
  });

  const onSubmit = async (values: PWAFormValues) => {
    if (!currentStorefrontId) {
      toast({
        title: "Error",
        description: "No storefront selected",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const dataToUpsert = {
        ...values,
        storefront_id: currentStorefrontId,
      };

      const { error } = await supabase
        .from("pwa_settings")
        .upsert({
          name: dataToUpsert.name,
          short_name: dataToUpsert.short_name,
          description: dataToUpsert.description,
          start_url: dataToUpsert.start_url,
          display: dataToUpsert.display,
          orientation: dataToUpsert.orientation,
          theme_color: dataToUpsert.theme_color,
          background_color: dataToUpsert.background_color,
          icon_72x72: dataToUpsert.icon_72x72,
          icon_96x96: dataToUpsert.icon_96x96,
          icon_128x128: dataToUpsert.icon_128x128,
          icon_144x144: dataToUpsert.icon_144x144,
          icon_152x152: dataToUpsert.icon_152x152,
          icon_192x192: dataToUpsert.icon_192x192,
          icon_384x384: dataToUpsert.icon_384x384,
          icon_512x512: dataToUpsert.icon_512x512,
          screenshot_mobile: dataToUpsert.screenshot_mobile,
          screenshot_desktop: dataToUpsert.screenshot_desktop,
          storefront_id: currentStorefrontId,
        });

      if (error) throw error;

      // Generate manifest preview
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-manifest?storefrontId=${currentStorefrontId}`);
      const manifest = await response.json();
      setManifestJson(JSON.stringify(manifest, null, 2));

      toast({
        title: "Success",
        description: "PWA settings saved and manifest generated successfully",
      });
    } catch (error) {
      console.error("Error saving PWA settings:", error);
      toast({
        title: "Error",
        description: "Failed to save PWA settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PWABasicInfo form={form} />
        <PWAIcons form={form} />
        <PWAScreenshots form={form} />
        
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save & Create Manifest
        </Button>

        {manifestJson && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Manifest</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                <code>{manifestJson}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}