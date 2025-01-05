import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractColors } from "@/utils/colorExtractor";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { Separator } from "@/components/ui/separator";

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
          <CardTitle>Color Settings</CardTitle>
          <Button
            variant="outline"
            onClick={handleSuggestColors}
            disabled={!logoUrl}
          >
            Suggest Colors from Logo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
        <ColorPicker
          label="Main Color"
          colors={predefinedColors.primary}
          selectedColor={form.watch("main_color")}
          onColorSelect={(color) => form.setValue("main_color", color)}
        />
        <ColorPicker
          label="Secondary Color"
          colors={predefinedColors.secondary}
          selectedColor={form.watch("secondary_color")}
          onColorSelect={(color) => form.setValue("secondary_color", color)}
        />
        <ColorPicker
          label="Font Color"
          colors={predefinedColors.accent}
          selectedColor={form.watch("font_color")}
          onColorSelect={(color) => form.setValue("font_color", color)}
        />

        <Separator className="my-6" />

        <h3 className="text-lg font-medium mb-4">Verification Colors</h3>
        <ColorPicker
          label="Button Color"
          colors={predefinedColors.primary}
          selectedColor={form.watch("verification_button_color")}
          onColorSelect={(color) => form.setValue("verification_button_color", color)}
        />
        <ColorPicker
          label="Button Text Color"
          colors={predefinedColors.accent}
          selectedColor={form.watch("verification_button_text_color")}
          onColorSelect={(color) => form.setValue("verification_button_text_color", color)}
        />
        <ColorPicker
          label="Text Color"
          colors={predefinedColors.accent}
          selectedColor={form.watch("verification_text_color")}
          onColorSelect={(color) => form.setValue("verification_text_color", color)}
        />
        <ColorPicker
          label="Checkbox Color"
          colors={predefinedColors.primary}
          selectedColor={form.watch("verification_checkbox_color")}
          onColorSelect={(color) => form.setValue("verification_checkbox_color", color)}
        />
        <ColorPicker
          label="Input Border Color"
          colors={predefinedColors.accent}
          selectedColor={form.watch("verification_input_border_color")}
          onColorSelect={(color) => form.setValue("verification_input_border_color", color)}
        />
      </CardContent>
    </Card>
  );
}