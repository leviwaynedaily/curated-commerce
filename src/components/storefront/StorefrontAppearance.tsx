import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { extractColorsFromLogo } from "@/utils/colorExtractor";
import { useToast } from "@/components/ui/use-toast";
import { ColorInput } from "./appearance/ColorInput";
import { ColorPreview } from "./appearance/ColorPreview";
import { BrowserAssets } from "./appearance/BrowserAssets";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const [previewColors, setPreviewColors] = useState(form.getValues("theme_config.colors"));
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: storefront } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) return null;
      const { data, error } = await supabase
        .from("storefronts")
        .select("logo_url")
        .eq("id", currentStorefrontId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!currentStorefrontId
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.theme_config?.colors) {
        setPreviewColors(value.theme_config.colors);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleExtractColors = async () => {
    if (!storefront?.logo_url) {
      toast({
        title: "No logo found",
        description: "Please upload a logo in the Basic Information section first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExtracting(true);
      const colors = await extractColorsFromLogo(storefront.logo_url);
      form.setValue("theme_config.colors", colors);
      
      toast({
        title: "Colors extracted",
        description: "Color palette has been updated based on your logo.",
      });
    } catch (error) {
      console.error('Error extracting colors:', error);
      toast({
        title: "Error",
        description: "Failed to extract colors from logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize your storefront's colors and appearance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {storefront?.logo_url && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Current Logo</p>
              <div className="w-32 h-32 border rounded-lg overflow-hidden bg-white p-2">
                <img
                  src={storefront.logo_url}
                  alt="Storefront Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleExtractColors}
            disabled={isExtracting}
            className="w-full mb-4"
          >
            {isExtracting ? "Extracting Colors..." : "Suggest Colors from Logo"}
          </Button>

          <BrowserAssets form={form} storefrontId={currentStorefrontId} />

          <Separator />

          <div>
            <h3 className="mb-4 text-sm font-medium">Background Colors</h3>
            <div className="space-y-4">
              <ColorInput label="Primary Background" path="background.primary" form={form} />
              <ColorInput label="Secondary Background" path="background.secondary" form={form} />
              <ColorInput label="Accent Background" path="background.accent" form={form} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-sm font-medium">Font Colors</h3>
            <div className="space-y-4">
              <ColorInput label="Primary Font" path="font.primary" form={form} />
              <ColorInput label="Secondary Font" path="font.secondary" form={form} />
              <ColorInput label="Highlight Font" path="font.highlight" form={form} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium">Live Preview</h3>
          <ColorPreview colors={previewColors} />
        </div>
      </div>
    </div>
  );
}