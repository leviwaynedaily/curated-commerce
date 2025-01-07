import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PWAIconUploadProps {
  form: UseFormReturn<any>;
  name: string;
  size: string;
  description: string;
}

export function PWAIconUpload({ form, name, size, description }: PWAIconUploadProps) {
  const { toast } = useToast();
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const expectedSize = parseInt(size.split('x')[0]);
  
  const handleUpload = async (url: string | null) => {
    console.log(`Setting ${name} to:`, url);
    form.setValue(name, url);
    
    // Get the current storefront ID
    const currentStorefrontId = localStorage.getItem('lastStorefrontId');
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

  const handleImageLoad = (dimensions: { width: number; height: number } | null) => {
    setImageDimensions(dimensions);
  };

  const isDimensionsIncorrect = imageDimensions && (
    imageDimensions.width !== expectedSize || 
    imageDimensions.height !== expectedSize
  );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{size} Icon</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
      
      {isDimensionsIncorrect && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Image dimensions ({imageDimensions.width}x{imageDimensions.height}) do not match the recommended size ({size}).
            This may affect how your icon appears on different devices.
          </AlertDescription>
        </Alert>
      )}
      
      <ImageUpload
        value={form.watch(name)}
        onChange={handleUpload}
        bucket="storefront-assets"
        path={`pwa/icons/${size}`}
        storefrontId={localStorage.getItem('lastStorefrontId') || undefined}
        enforceFilename={`${size}.png`}
        onImageLoad={handleImageLoad}
      />
    </div>
  );
}