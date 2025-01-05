import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractColors } from "@/utils/colorExtractor";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { SuggestedColorPalette } from "./SuggestedColorPalette";
import { useToast } from "@/hooks/use-toast";

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
        setPredefinedColors(colors);
      }
    };
    loadColors();
  }, [logoUrl]);

  const handleSuggestColors = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    if (logoUrl) {
      console.log('Suggesting colors from logo URL:', logoUrl);
      console.log('Current logo preview element:', document.querySelector('img[alt="Current logo"]')?.getAttribute('src'));
      const colors = await extractColors(logoUrl);
      console.log('Generated color palette:', colors);
      setPredefinedColors(colors);
      
      // Show success toast
      toast({
        title: "Colors Generated",
        description: "Color suggestions have been generated from your logo.",
      });
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
            type="button" // Explicitly set type to button
          >
            Suggest Colors from Logo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {logoUrl && (
          <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Logo:</p>
            <img
              src={logoUrl}
              alt="Current logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        )}

        <SuggestedColorPalette colors={predefinedColors} />

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Brand Colors</h3>
          <ColorPicker
            label="Main Color"
            colors={[]}
            selectedColor={form.watch("main_color")}
            onColorSelect={(color) => form.setValue("main_color", color)}
          />
          <ColorPicker
            label="Secondary Color"
            colors={[]}
            selectedColor={form.watch("secondary_color")}
            onColorSelect={(color) => form.setValue("secondary_color", color)}
          />
          <ColorPicker
            label="Font Color"
            colors={[]}
            selectedColor={form.watch("font_color")}
            onColorSelect={(color) => form.setValue("font_color", color)}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Verification Colors</h3>
          <ColorPicker
            label="Button Color"
            colors={[]}
            selectedColor={form.watch("verification_button_color")}
            onColorSelect={(color) => form.setValue("verification_button_color", color)}
          />
          <ColorPicker
            label="Button Text Color"
            colors={[]}
            selectedColor={form.watch("verification_button_text_color")}
            onColorSelect={(color) => form.setValue("verification_button_text_color", color)}
          />
          <ColorPicker
            label="Text Color"
            colors={[]}
            selectedColor={form.watch("verification_text_color")}
            onColorSelect={(color) => form.setValue("verification_text_color", color)}
          />
          <ColorPicker
            label="Checkbox Color"
            colors={[]}
            selectedColor={form.watch("verification_checkbox_color")}
            onColorSelect={(color) => form.setValue("verification_checkbox_color", color)}
          />
          <ColorPicker
            label="Input Border Color"
            colors={[]}
            selectedColor={form.watch("verification_input_border_color")}
            onColorSelect={(color) => form.setValue("verification_input_border_color", color)}
          />
        </div>
      </CardContent>
    </Card>
  );
}