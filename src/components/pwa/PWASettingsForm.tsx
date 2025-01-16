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
import { PWAFormValues, pwaFormSchema } from "./types";
import { PWAFormValidation } from "./PWAFormValidation";
import { PWAFormActions } from "./PWAFormActions";
import { PWAManifestPreview } from "./PWAManifestPreview";
import { PWAManifestUrl } from "./PWAManifestUrl";
import { saveManifest } from "@/utils/manifestUtils";
import { useState, useEffect } from "react";

const PALMTREE_MANIFEST_URL = "https://bplsogdsyabqfftwclka.supabase.co/storage/v1/object/public/storefront-assets/pwa/palmtree-smokes/manifest.json";

export function PWASettingsForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [manifestJson, setManifestJson] = useState<string | null>(null);
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
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

      console.log("PWA settings fetched:", data);
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
      setManifestUrl(pwaSettings.manifest_url);
    }
  }, [pwaSettings, isPwaLoading, form]);

  const hasRequiredFields = !![
    form.getValues("name"),
    form.getValues("short_name"),
    form.getValues("icon_192x192"),
    form.getValues("icon_512x512"),
  ].every(Boolean);

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
        storefront_id: currentStorefrontId,
        name: values.name || "",
        short_name: values.short_name || "",
        manifest_url: PALMTREE_MANIFEST_URL
      };
      
      console.log("Saving PWA settings draft:", dataToSave);
      
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

  const publishPWA = async () => {
    if (!currentStorefrontId) {
      toast({
        title: "Error",
        description: "No manifest URL available. Please save the manifest first.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      console.log("Publishing PWA for storefront:", currentStorefrontId);
      
      // Generate static files first
      const { error: generateError } = await supabase.functions
        .invoke('generate-storefront', {
          body: { storefrontId: currentStorefrontId }
        });

      if (generateError) {
        throw new Error('Failed to generate static files: ' + generateError.message);
      }

      // Update storefront with PWA settings
      const { error: updateError } = await supabase
        .from("storefronts")
        .update({
          pwa_manifest_url: PALMTREE_MANIFEST_URL,
          has_pwa: true
        } as any)
        .eq('id', currentStorefrontId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "PWA published successfully! Your storefront is now installable.",
      });
    } catch (error) {
      console.error("Error publishing PWA:", error);
      toast({
        title: "Error",
        description: "Failed to publish PWA: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
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
      // Save PWA settings with the manifest URL first
      const dataToSave = {
        ...values,
        storefront_id: currentStorefrontId,
        name: values.name || "",
        short_name: values.short_name || "",
        manifest_url: PALMTREE_MANIFEST_URL
      };
      
      console.log("Saving PWA settings:", dataToSave);
      
      const { error: saveError } = await supabase
        .from("pwa_settings")
        .upsert(dataToSave, {
          onConflict: 'storefront_id'
        });

      if (saveError) throw saveError;

      // Generate manifest JSON
      const manifestData = {
        name: values.name,
        short_name: values.short_name,
        description: values.description,
        start_url: values.start_url || "/",
        display: values.display || "standalone",
        orientation: values.orientation || "any",
        theme_color: values.theme_color || "#000000",
        background_color: values.background_color || "#ffffff",
        icons: [
          values.icon_72x72 && { src: values.icon_72x72, sizes: "72x72", type: "image/png" },
          values.icon_96x96 && { src: values.icon_96x96, sizes: "96x96", type: "image/png" },
          values.icon_128x128 && { src: values.icon_128x128, sizes: "128x128", type: "image/png" },
          values.icon_144x144 && { src: values.icon_144x144, sizes: "144x144", type: "image/png" },
          values.icon_152x152 && { src: values.icon_152x152, sizes: "152x152", type: "image/png" },
          values.icon_192x192 && { src: values.icon_192x192, sizes: "192x192", type: "image/png" },
          values.icon_384x384 && { src: values.icon_384x384, sizes: "384x384", type: "image/png" },
          values.icon_512x512 && { src: values.icon_512x512, sizes: "512x512", type: "image/png" },
        ].filter(Boolean),
        screenshots: [
          values.screenshot_mobile && {
            src: values.screenshot_mobile,
            sizes: "640x1136",
            type: "image/png",
            form_factor: "narrow"
          },
          values.screenshot_desktop && {
            src: values.screenshot_desktop,
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide"
          }
        ].filter(Boolean)
      };

      // Save manifest file
      await saveManifest(currentStorefrontId, manifestData);
      setManifestUrl(PALMTREE_MANIFEST_URL);
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
          onPublish={publishPWA}
          isPublishing={isPublishing}
        />

        <PWAManifestUrl manifestUrl={manifestUrl} />
        <PWAManifestPreview manifestJson={manifestJson} />
      </form>
    </Form>
  );
}
