import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractColors } from "@/utils/colorExtractor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    e.preventDefault();
    if (logoUrl) {
      console.log('Suggesting colors from logo URL:', logoUrl);
      console.log('Current logo preview element:', document.querySelector('img[alt="Current logo"]')?.getAttribute('src'));
      const colors = await extractColors(logoUrl);
      console.log('Generated color palette:', colors);
      setPredefinedColors(colors);
      
      toast({
        title: "Colors Generated",
        description: "Color suggestions have been generated from your logo.",
      });
    }
  };

  const handleColorChange = (field: string, value: string) => {
    form.setValue(field, value);
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
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Main Colors</h4>
            <div className="flex gap-2">
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("main_color") }}
                  onClick={() => document.getElementById("main_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("main_color")}</p>
                <Input
                  id="main_color"
                  type="color"
                  value={form.watch("main_color")}
                  onChange={(e) => handleColorChange("main_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Secondary Colors</h4>
            <div className="flex gap-2">
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("secondary_color") }}
                  onClick={() => document.getElementById("secondary_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("secondary_color")}</p>
                <Input
                  id="secondary_color"
                  type="color"
                  value={form.watch("secondary_color")}
                  onChange={(e) => handleColorChange("secondary_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Font Colors</h4>
            <div className="flex gap-2">
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("font_color") }}
                  onClick={() => document.getElementById("font_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("font_color")}</p>
                <Input
                  id="font_color"
                  type="color"
                  value={form.watch("font_color")}
                  onChange={(e) => handleColorChange("font_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Verification Colors</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Button Color</h4>
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("verification_button_color") }}
                  onClick={() => document.getElementById("verification_button_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("verification_button_color")}</p>
                <Input
                  id="verification_button_color"
                  type="color"
                  value={form.watch("verification_button_color")}
                  onChange={(e) => handleColorChange("verification_button_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Button Text</h4>
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("verification_button_text_color") }}
                  onClick={() => document.getElementById("verification_button_text_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("verification_button_text_color")}</p>
                <Input
                  id="verification_button_text_color"
                  type="color"
                  value={form.watch("verification_button_text_color")}
                  onChange={(e) => handleColorChange("verification_button_text_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Text Color</h4>
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("verification_text_color") }}
                  onClick={() => document.getElementById("verification_text_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("verification_text_color")}</p>
                <Input
                  id="verification_text_color"
                  type="color"
                  value={form.watch("verification_text_color")}
                  onChange={(e) => handleColorChange("verification_text_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Checkbox Color</h4>
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("verification_checkbox_color") }}
                  onClick={() => document.getElementById("verification_checkbox_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("verification_checkbox_color")}</p>
                <Input
                  id="verification_checkbox_color"
                  type="color"
                  value={form.watch("verification_checkbox_color")}
                  onChange={(e) => handleColorChange("verification_checkbox_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Input Border</h4>
              <div className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
                  style={{ backgroundColor: form.watch("verification_input_border_color") }}
                  onClick={() => document.getElementById("verification_input_border_color")?.click()}
                />
                <p className="text-xs text-center font-mono">{form.watch("verification_input_border_color")}</p>
                <Input
                  id="verification_input_border_color"
                  type="color"
                  value={form.watch("verification_input_border_color")}
                  onChange={(e) => handleColorChange("verification_input_border_color", e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}