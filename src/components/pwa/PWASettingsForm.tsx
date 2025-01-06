import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PWABasicInfo } from "./PWABasicInfo";
import { PWAIcons } from "./PWAIcons";
import { PWAScreenshots } from "./PWAScreenshots";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PWAFormValues, pwaFormSchema } from "./types";

export function PWASettingsForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [manifestJson, setManifestJson] = useState<string | null>(null);
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: pwaSettings, isLoading: isPwaLoading } = useQuery({
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

  const { data: storefront, isLoading: isStorefrontLoading } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null;
      
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Fetched storefront data for PWA defaults:", data);
      return data;
    },
    enabled: !!currentStorefrontId,
  });

  const getDefaultShortName = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) return name;
    if (words[0].length <= 3 && words.length > 1) {
      return `${words[0]} ${words[1]}`;
    }
    return words[0];
  };

  const form = useForm<PWAFormValues>({
    resolver: zodResolver(pwaFormSchema),
    defaultValues: {
      name: pwaSettings?.name || storefront?.name || "",
      short_name: pwaSettings?.short_name || (storefront?.name ? getDefaultShortName(storefront.name) : ""),
      description: pwaSettings?.description || storefront?.description || "",
      start_url: pwaSettings?.start_url || "/",
      display: pwaSettings?.display || "standalone",
      orientation: pwaSettings?.orientation || "any",
      theme_color: pwaSettings?.theme_color || storefront?.main_color || "#000000",
      background_color: pwaSettings?.background_color || storefront?.storefront_background_color || "#ffffff",
      icon_72x72: pwaSettings?.icon_72x72 || "",
      icon_96x96: pwaSettings?.icon_96x96 || "",
      icon_128x128: pwaSettings?.icon_128x128 || "",
      icon_144x144: pwaSettings?.icon_144x144 || "",
      icon_152x152: pwaSettings?.icon_152x152 || "",
      icon_192x192: pwaSettings?.icon_192x192 || "",
      icon_384x384: pwaSettings?.icon_384x384 || "",
      icon_512x512: pwaSettings?.icon_512x512 || "",
      screenshot_mobile: pwaSettings?.screenshot_mobile || "",
      screenshot_desktop: pwaSettings?.screenshot_desktop || "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (storefront && !pwaSettings) {
      console.log("Updating form with storefront defaults");
      form.setValue('name', storefront.name);
      form.setValue('short_name', getDefaultShortName(storefront.name));
      form.setValue('description', storefront.description || '');
      form.setValue('theme_color', storefront.main_color || '#000000');
      form.setValue('background_color', storefront.storefront_background_color || '#ffffff');
    }
  }, [storefront, pwaSettings, form]);

  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;

  const saveDraft = async () => {
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
      const values = form.getValues();
      const { error } = await supabase
        .from("pwa_settings")
        .upsert({
          ...values,
          name: values.name || "",
          short_name: values.short_name || "",
          storefront_id: currentStorefrontId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "PWA settings draft saved successfully",
      });
    } catch (error) {
      console.error("Error saving PWA settings draft:", error);
      toast({
        title: "Error",
        description: "Failed to save PWA settings draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      const { error } = await supabase
        .from("pwa_settings")
        .upsert({
          ...values,
          name: values.name || "",
          short_name: values.short_name || "",
          storefront_id: currentStorefrontId,
        });

      if (error) throw error;

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

  if (isPwaLoading || isStorefrontLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const missingRequirements = [
    !form.watch("name") && "App name",
    !form.watch("short_name") && "Short name",
    !form.watch("icon_192x192") && "192x192 icon",
    !form.watch("icon_512x512") && "512x512 icon",
  ].filter(Boolean);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {missingRequirements.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Missing Required Fields</AlertTitle>
            <AlertDescription>
              The following fields are required to create a PWA manifest:
              <ul className="list-disc list-inside mt-2">
                {missingRequirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <PWABasicInfo form={form} />
        <PWAIcons form={form} />
        <PWAScreenshots form={form} />
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
            disabled={isSaving || !isDirty}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Draft
          </Button>

          <Button 
            type="submit" 
            disabled={isSaving || !isValid || missingRequirements.length > 0}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Create Manifest
          </Button>
        </div>

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