import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractColors } from "@/utils/colorExtractor";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

interface ColorManagementProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
  logoUrl: string | null;
}

export function ColorManagement({ form, storefrontId, logoUrl }: ColorManagementProps) {
  const [predefinedColors, setPredefinedColors] = useState<Record<string, string[]>>({
    primary: [],
    secondary: [],
    accent: [],
  });

  useEffect(() => {
    const loadColors = async () => {
      if (logoUrl) {
        const colors = await extractColors(logoUrl);
        setPredefinedColors(colors);
      }
    };
    loadColors();
  }, [logoUrl]);

  const handleSuggestColors = async () => {
    if (logoUrl) {
      const colors = await extractColors(logoUrl);
      setPredefinedColors(colors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Suggested Colors</CardTitle>
          <Button
            variant="outline"
            onClick={handleSuggestColors}
            disabled={!logoUrl}
          >
            Suggest Colors
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Primary Color</h3>
              <ColorPicker
                colors={predefinedColors.primary}
                selectedColor={form.watch("main_color")}
                onColorSelect={(color) => form.setValue("main_color", color)}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Secondary Color</h3>
              <ColorPicker
                colors={predefinedColors.secondary}
                selectedColor={form.watch("secondary_color")}
                onColorSelect={(color) => form.setValue("secondary_color", color)}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Font Color</h3>
              <ColorPicker
                colors={predefinedColors.accent}
                selectedColor={form.watch("font_color")}
                onColorSelect={(color) => form.setValue("font_color", color)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}