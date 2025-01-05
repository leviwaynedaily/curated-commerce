import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Wand2, ExternalLink } from "lucide-react";
import { extractColors } from "@/utils/colorExtractor";
import { useState, useEffect } from "react";
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

  const handleColorSelect = (category: string, color: string) => {
    switch (category) {
      case 'primary':
        form.setValue("main_color", color);
        break;
      case 'secondary':
        form.setValue("secondary_color", color);
        break;
      case 'accent':
        form.setValue("font_color", color);
        break;
    }
  };

  const openPreviewWindow = () => {
    if (storefrontId) {
      window.open(
        `/preview?storefrontId=${storefrontId}`,
        'StorefrontPreview',
        'width=390,height=844,resizable=yes'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Colors</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <h4 className="text-sm font-medium mb-4">Main Colors</h4>
          <div className="space-y-4">
            <ColorPicker
              label="Main Color"
              value={form.watch("main_color")}
              onChange={(value) => form.setValue("main_color", value)}
            />
            <ColorPicker
              label="Secondary Color"
              value={form.watch("secondary_color")}
              onChange={(value) => form.setValue("secondary_color", value)}
            />
            <ColorPicker
              label="Font Color"
              value={form.watch("font_color")}
              onChange={(value) => form.setValue("font_color", value)}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-sm font-medium">Suggested Colors</h4>
            <Button 
              onClick={openPreviewWindow}
              variant="outline"
              className="w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Preview Window
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSuggestColors}
            className="w-auto mb-6"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Suggest from Logo
          </Button>
          {Object.entries(predefinedColors).map(([category, colors]) => (
            <div key={category} className="mb-6">
              <h5 className="text-xs font-medium capitalize mb-2">{category}</h5>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(category, color)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Verification Colors</h4>
          <div className="space-y-4">
            <ColorPicker
              label="Button Color"
              value={form.watch("verification_button_color")}
              onChange={(value) => form.setValue("verification_button_color", value)}
            />
            <ColorPicker
              label="Button Text Color"
              value={form.watch("verification_button_text_color")}
              onChange={(value) => form.setValue("verification_button_text_color", value)}
            />
            <ColorPicker
              label="Text Color"
              value={form.watch("verification_text_color")}
              onChange={(value) => form.setValue("verification_text_color", value)}
            />
            <ColorPicker
              label="Checkbox Color"
              value={form.watch("verification_checkbox_color")}
              onChange={(value) => form.setValue("verification_checkbox_color", value)}
            />
            <ColorPicker
              label="Input Border Color"
              value={form.watch("verification_input_border_color")}
              onChange={(value) => form.setValue("verification_input_border_color", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}