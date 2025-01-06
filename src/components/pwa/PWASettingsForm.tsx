import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PWABasicInfo } from "./PWABasicInfo";
import { PWAIcons } from "./PWAIcons";
import { PWAScreenshots } from "./PWAScreenshots";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PWAFormValues, pwaFormSchema } from "./types";
import { PWAFormValidation } from "./PWAFormValidation";
import { PWAFormActions } from "./PWAFormActions";
import { useState, useEffect } from "react";

export function PWASettingsForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [manifestJson, setManifestJson] = useState<string | null>(null);
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: pwaSettings, isLoading: isPwaLoading } = useQuery({
    queryKey: ["pwa-settings", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) {
        console.log("No storefront ID found for PWA settings");
        return null;
      }
      
      console.log("Fetching PWA settings for storefront:", currentStorefrontId);
      const { data, error } = await supabase
        .from("pwa_settings")
        .select("*")
        .eq("storefront_id", currentStorefrontId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching PWA settings:", error);
        throw error;
      }

      if (!data) {
        console.log("No PWA settings found, will use defaults");
      } else {
        console.log("Successfully fetched PWA settings:", {
          name: data.name,
          short_name: data.short_name,
          icons: {
            '72x72': data.icon_72x72 ? '✓' : '✗',
            '96x96': data.icon_96x96 ? '✓' : '✗',
            '128x128': data.icon_128x128 ? '✓' : '✗',
            '144x144': data.icon_144x144 ? '✓' : '✗',
            '152x152': data.icon_152x152 ? '✓' : '✗',
            '192x192': data.icon_192x192 ? '✓' : '✗',
            '384x384': data.icon_384x384 ? '✓' : '✗',
            '512x512': data.icon_512x512 ? '✓' : '✗',
          },
          screenshots: {
            mobile: data.screenshot_mobile ? '✓' : '✗',
            desktop: data.screenshot_desktop ? '✓' : '✗',
          }
        });
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
      icon_72x72: null,
      icon_96x96: null,
      icon_128x128: null,
      icon_144x144: null,
      icon_152x152: null,
      icon_192x192: "",
      icon_384x384: null,
      icon_512x512: "",
      screenshot_mobile: null,
      screenshot_desktop: null,
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (!isPwaLoading && pwaSettings) {
      console.log("Setting form values from PWA settings");
      form.reset(pwaSettings);
    }
  }, [pwaSettings, isPwaLoading, form]);

  const hasRequiredFields = !![
    form.getValues("name"),
    form.getValues("short_name"),
    form.getValues("icon_192x192"),
    form.getValues("icon_512x512"),
  ].every(Boolean);

  console.log("Form validation state:", {
    hasRequiredFields,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    values: form.getValues(),
  });

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
      const dataToSave = {
        ...values,
        name: values.name || "", // Ensure name is never undefined
        short_name: values.short_name || "", // Ensure short_name is never undefined
        storefront_id: currentStorefrontId,
      };
      
      console.log("Saving PWA settings draft with values:", dataToSave);
      
      const { error } = await supabase
        .from("pwa_settings")
        .upsert(dataToSave, {
          onConflict: 'storefront_id'
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
      const dataToSave = {
        ...values,
        name: values.name || "", // Ensure name is never undefined
        short_name: values.short_name || "", // Ensure short_name is never undefined
        storefront_id: currentStorefrontId,
      };
      
      console.log("Saving PWA settings with values:", {
        ...dataToSave,
        icons: {
          '72x72': values.icon_72x72 ? '✓' : '✗',
          '96x96': values.icon_96x96 ? '✓' : '✗',
          '128x128': values.icon_128x128 ? '✓' : '✗',
          '144x144': values.icon_144x144 ? '✓' : '✗',
          '152x152': values.icon_152x152 ? '✓' : '✗',
          '192x192': values.icon_192x192 ? '✓' : '✗',
          '384x384': values.icon_384x384 ? '✓' : '✗',
          '512x512': values.icon_512x512 ? '✓' : '✗',
        },
        screenshots: {
          mobile: values.screenshot_mobile ? '✓' : '✗',
          desktop: values.screenshot_desktop ? '✓' : '✗',
        }
      });
      
      const { error: saveError } = await supabase
        .from("pwa_settings")
        .upsert(dataToSave, {
          onConflict: 'storefront_id'
        });

      if (saveError) {
        console.error("Error saving PWA settings:", saveError);
        throw saveError;
      }

      console.log("PWA settings saved, generating manifest...");
      const { data: manifestData, error: manifestError } = await supabase.functions.invoke('get-manifest', {
        method: 'POST',
        body: { storefrontId: currentStorefrontId }
      });
      
      if (manifestError) {
        console.error("Manifest generation failed:", manifestError);
        throw new Error(`Failed to generate manifest: ${manifestError.message}`);
      }

      console.log("Generated manifest:", manifestData);
      setManifestJson(JSON.stringify(manifestData, null, 2));

      toast({
        title: "Success",
        description: "PWA settings saved and manifest generated successfully",
      });
    } catch (error) {
      console.error("Error in PWA settings submission:", error);
      toast({
        title: "Error",
        description: `Failed to save PWA settings and generate manifest: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isPwaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PWAFormValidation form={form} />
        <PWABasicInfo form={form} />
        <PWAIcons form={form} />
        <PWAScreenshots form={form} />
        
        <PWAFormActions 
          form={form}
          isSaving={isSaving}
          onSaveDraft={saveDraft}
          hasRequiredFields={hasRequiredFields}
        />

        {manifestJson && (
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Generated Manifest</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary/5 p-2 rounded-lg overflow-x-auto">
                <code className="text-[10px] font-mono whitespace-pre-wrap break-all leading-tight">
                  {manifestJson}
                </code>
              </pre>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}