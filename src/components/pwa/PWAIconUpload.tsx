import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PWAIconUploadProps {
  form: UseFormReturn<any>;
  name: string;
  size: string;
  description: string;
}

export function PWAIconUpload({ form, name, size, description }: PWAIconUploadProps) {
  const { toast } = useToast();
  
  const handleUpload = async (url: string | null) => {
    console.log(`Setting ${name} to:`, url);
    form.setValue(name, url);
    
    // Get the current storefront ID
    const currentStorefrontId = localStorage.getItem('lastStorefrontId');
    if (!currentStorefrontId) {
      console.error("No storefront selected");
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

      if (error) throw error;

      toast({
        title: "Success",
        description: "Icon uploaded and settings saved",
      });
    } catch (error) {
      console.error("Error auto-saving PWA settings draft:", error);
      toast({
        title: "Warning",
        description: "Icon uploaded but failed to save settings. Please save manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{size} Icon</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
      <ImageUpload
        value={form.watch(name)}
        onChange={handleUpload}
        bucket="storefront-assets"
        path={`pwa/icons/${size}`}
        storefrontId={localStorage.getItem('lastStorefrontId') || undefined}
        enforceFilename={`${size}.png`}
      />
    </div>
  );
}