import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PWAIconsProps {
  form: UseFormReturn<any>;
}

export function PWAIcons({ form }: PWAIconsProps) {
  const { toast } = useToast();
  const [isResizing, setIsResizing] = useState(false);
  const storefrontId = localStorage.getItem('lastStorefrontId');

  const handleMainIconUpload = async (url: string) => {
    if (!url || !storefrontId) return;

    setIsResizing(true);
    try {
      console.log('Starting icon resize process with URL:', url);
      
      const { data, error } = await supabase.functions.invoke('resize-pwa-icon', {
        body: {
          imageUrl: url,
          storefrontId,
        },
      });

      if (error) {
        console.error('Error from resize function:', error);
        throw error;
      }

      console.log('Received resized icons:', data.icons);

      // Update all icon fields in the form
      Object.entries(data.icons).forEach(([key, value]) => {
        form.setValue(key, value);
      });

      toast({
        title: "Success",
        description: "All icon sizes have been generated and saved",
      });
    } catch (error) {
      console.error('Error resizing icons:', error);
      toast({
        title: "Error",
        description: "Failed to generate icon sizes",
        variant: "destructive",
      });
    } finally {
      setIsResizing(false);
    }
  };

  const iconSizes = [
    { name: "icon_72x72", size: "72x72" },
    { name: "icon_96x96", size: "96x96" },
    { name: "icon_128x128", size: "128x128" },
    { name: "icon_144x144", size: "144x144" },
    { name: "icon_152x152", size: "152x152" },
    { name: "icon_192x192", size: "192x192" },
    { name: "icon_384x384", size: "384x384" },
    { name: "icon_512x512", size: "512x512" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">App Icons</h2>
        <p className="text-sm text-muted-foreground">
          Upload a 512x512 icon and we'll automatically generate all required sizes
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Main Icon (512x512)</h3>
          <p className="text-sm text-muted-foreground">
            Upload your main icon here and we'll automatically generate all other sizes
          </p>
          <ImageUpload
            value={form.watch("icon_512x512")}
            onChange={(url) => {
              form.setValue("icon_512x512", url);
              if (url) handleMainIconUpload(url);
            }}
            bucket="storefront-assets"
            path={`pwa/icons/512x512`}
            storefrontId={storefrontId || undefined}
          />
        </div>

        {isResizing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating icon sizes...
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {iconSizes.slice(0, -1).map(({ name, size }) => (
            <div key={name} className="space-y-2">
              <h3 className="text-sm font-medium">{size} Icon</h3>
              <div className="relative">
                {form.watch(name) ? (
                  <div className="w-32 h-32 bg-white dark:bg-white rounded-md p-2">
                    <img
                      src={form.watch(name)}
                      alt={`${size} icon`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-secondary rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Auto-generated</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}