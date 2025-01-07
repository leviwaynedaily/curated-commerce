import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PWAScreenshotsProps {
  form: UseFormReturn<any>;
}

export function PWAScreenshots({ form }: PWAScreenshotsProps) {
  const { toast } = useToast();
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const handleUpload = async (url: string | null, field: string) => {
    console.log(`Setting ${field} to:`, url);
    form.setValue(field, url);
    
    if (!currentStorefrontId) {
      console.error("No storefront selected");
      toast({
        title: "Error",
        description: "No storefront selected. Please select a storefront first.",
        variant: "destructive",
      });
      return;
    }

    // Automatically save draft after upload
    try {
      const values = form.getValues();
      console.log("Auto-saving PWA settings draft after upload with values:", { ...values, storefront_id: currentStorefrontId });
      
      const { error } = await supabase
        .from("pwa_settings")
        .upsert({
          ...values,
          name: values.name || "",
          short_name: values.short_name || "",
          storefront_id: currentStorefrontId,
        }, {
          onConflict: 'storefront_id'
        });

      if (error) {
        console.error("Error auto-saving PWA settings draft:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Screenshot uploaded and settings saved",
      });
    } catch (error) {
      console.error("Error auto-saving PWA settings draft:", error);
      toast({
        title: "Warning",
        description: "Screenshot uploaded but failed to save settings. Please save manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">App Screenshots</h2>
        <p className="text-sm text-muted-foreground">
          Upload screenshots of your app for different devices
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Mobile Screenshot</h3>
          <p className="text-xs text-muted-foreground">
            Recommended size: 360x640px
          </p>
          <ImageUpload
            value={form.watch("screenshot_mobile")}
            onChange={(url) => handleUpload(url, "screenshot_mobile")}
            bucket="storefront-assets"
            path="pwa/screenshots/mobile"
            storefrontId={currentStorefrontId || undefined}
            enforceFilename="mobile_screenshot.png"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Desktop Screenshot</h3>
          <p className="text-xs text-muted-foreground">
            Recommended size: 1920x1080px
          </p>
          <ImageUpload
            value={form.watch("screenshot_desktop")}
            onChange={(url) => handleUpload(url, "screenshot_desktop")}
            bucket="storefront-assets"
            path="pwa/screenshots/desktop"
            storefrontId={currentStorefrontId || undefined}
            enforceFilename="desktop_screenshot.png"
          />
        </div>
      </div>
    </div>
  );
}