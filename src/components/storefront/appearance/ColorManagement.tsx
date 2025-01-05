import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { extractColorsFromLogo } from "@/utils/colorExtractor";
import { useToast } from "@/components/ui/use-toast";

interface ColorManagementProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
  logoUrl?: string | null;
}

const predefinedColors = {
  neutrals: [
    { name: "Neutral Gray", value: "#8E9196" },
    { name: "Dark Purple", value: "#1A1F2C" },
    { name: "Charcoal Gray", value: "#403E43" },
  ],
  purples: [
    { name: "Primary Purple", value: "#9b87f5" },
    { name: "Secondary Purple", value: "#7E69AB" },
    { name: "Light Purple", value: "#D6BCFA" },
    { name: "Soft Purple", value: "#E5DEFF" },
    { name: "Vivid Purple", value: "#8B5CF6" },
  ],
  accents: [
    { name: "Soft Green", value: "#F2FCE2" },
    { name: "Soft Yellow", value: "#FEF7CD" },
    { name: "Soft Orange", value: "#FEC6A1" },
    { name: "Soft Pink", value: "#FFDEE2" },
    { name: "Soft Peach", value: "#FDE1D3" },
    { name: "Soft Blue", value: "#D3E4FD" },
    { name: "Magenta Pink", value: "#D946EF" },
    { name: "Bright Orange", value: "#F97316" },
    { name: "Ocean Blue", value: "#0EA5E9" },
  ],
};

export function ColorManagement({ form, storefrontId, logoUrl }: ColorManagementProps) {
  const { toast } = useToast();

  const handleSuggestColors = async () => {
    if (!logoUrl) {
      toast({
        title: "No logo found",
        description: "Please upload a logo first to get color suggestions",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Extracting colors from logo:", logoUrl);
      const colors = await extractColorsFromLogo(logoUrl);
      console.log("Extracted colors:", colors);

      form.setValue("main_color", colors.background.primary);
      form.setValue("secondary_color", colors.background.secondary);
      form.setValue("font_color", colors.font.primary);
      form.setValue("verification_button_color", colors.background.primary);
      form.setValue("verification_button_text_color", "#FFFFFF");
      form.setValue("verification_text_color", colors.font.primary);
      form.setValue("verification_checkbox_color", colors.background.primary);
      form.setValue("verification_input_border_color", "#E5E7EB");

      toast({
        title: "Colors updated",
        description: "Color scheme has been updated based on your logo",
      });
    } catch (error) {
      console.error("Error extracting colors:", error);
      toast({
        title: "Error",
        description: "Failed to extract colors from logo",
        variant: "destructive",
      });
    }
  };

  const ColorPicker = ({ name, label }: { name: string; label: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-4">
            <input
              type="color"
              {...field}
              className="h-10 w-20 cursor-pointer rounded border bg-white p-1"
            />
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="h-10 w-32 rounded border px-3"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Colors</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleSuggestColors}
          className="w-full mb-8"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Suggest from Logo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium mb-4">General Colors</h4>
          <ColorPicker name="main_color" label="Main Color" />
          <ColorPicker name="secondary_color" label="Secondary Color" />
          <ColorPicker name="font_color" label="Font Color" />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Verification Colors</h4>
          <ColorPicker name="verification_button_color" label="Button Color" />
          <ColorPicker name="verification_button_text_color" label="Button Text Color" />
          <ColorPicker name="verification_text_color" label="Text Color" />
          <ColorPicker name="verification_checkbox_color" label="Checkbox Color" />
          <ColorPicker name="verification_input_border_color" label="Input Border Color" />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Suggested Colors</h4>
        {Object.entries(predefinedColors).map(([category, colors]) => (
          <div key={category} className="mb-6">
            <h5 className="text-xs font-medium capitalize mb-2">{category}</h5>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => form.setValue("main_color", color.value)}
                  className="group relative h-8 w-8 rounded-full border"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  <span className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 rounded bg-black/75 px-2 py-1 text-xs text-white group-hover:block">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}