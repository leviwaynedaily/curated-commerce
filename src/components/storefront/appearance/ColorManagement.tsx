import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractColors } from "@/utils/colorExtractor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SuggestedColorPalette } from "./SuggestedColorPalette";
import { BrandColors } from "./BrandColors";
import { VerificationColors } from "./VerificationColors";
import { ProductCardColors } from "./ProductCardColors";
import { HeaderSettings } from "./HeaderSettings";
import { ThemeConfig } from "@/types/theme";

interface ColorManagementProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
  logoUrl: string | null;
}

interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
}

export function ColorManagement({ form, storefrontId, logoUrl }: ColorManagementProps) {
  const { toast } = useToast();
  const [predefinedColors, setPredefinedColors] = useState<ColorPalette>({
    primary: [],
    secondary: [],
    accent: [],
  });

  useEffect(() => {
    const loadColors = async () => {
      if (logoUrl) {
        console.log('Initial color extraction from logo URL:', logoUrl);
        const colors = await extractColors(logoUrl);
        // Convert ThemeConfig colors to ColorPalette format
        setPredefinedColors({
          primary: [colors.background.primary, colors.font.primary],
          secondary: [colors.background.secondary, colors.font.secondary],
          accent: [colors.background.accent, colors.font.highlight],
        });
      }
    };
    loadColors();
  }, [logoUrl]);

  const handleSuggestColors = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (logoUrl) {
      console.log('Suggesting colors from logo URL:', logoUrl);
      const colors = await extractColors(logoUrl);
      // Convert ThemeConfig colors to ColorPalette format
      const palette = {
        primary: [colors.background.primary, colors.font.primary],
        secondary: [colors.background.secondary, colors.font.secondary],
        accent: [colors.background.accent, colors.font.highlight],
      };
      setPredefinedColors(palette);
      
      // Set some suggested colors from the palette
      if (palette.primary.length > 0) {
        form.setValue('main_color', palette.primary[0]);
      }
      if (palette.secondary.length > 0) {
        form.setValue('secondary_color', palette.secondary[0]);
      }
      if (palette.accent.length > 0) {
        form.setValue('font_color', palette.accent[0]);
      }
      
      toast({
        title: "Colors Generated",
        description: "Color suggestions have been generated from your logo.",
      });
    }
  };

  const handleColorChange = (field: string, value: string) => {
    console.log(`Updating color field: ${field} with value: ${value}`);
    form.setValue(field, value, { shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Color Settings</CardTitle>
          <Button
            variant="outline"
            onClick={handleSuggestColors}
            disabled={!logoUrl}
            type="button"
          >
            Suggest Colors from Logo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <SuggestedColorPalette colors={predefinedColors} logoUrl={logoUrl} />
        <HeaderSettings form={form} />
        <BrandColors form={form} onColorChange={handleColorChange} />
        <VerificationColors form={form} onColorChange={handleColorChange} />
        <ProductCardColors form={form} onColorChange={handleColorChange} />
      </CardContent>
    </Card>
  );
}