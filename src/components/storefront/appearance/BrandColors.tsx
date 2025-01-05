import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ColorGrid } from "./ColorGrid";

interface BrandColorsProps {
  form: UseFormReturn<any>;
  onColorChange: (field: string, value: string) => void;
}

export function BrandColors({ form, onColorChange }: BrandColorsProps) {
  const brandColors = [
    { field: "main_color", label: "Main Color" },
    { field: "secondary_color", label: "Secondary Color" },
    { field: "font_color", label: "Font Color" },
  ].map(({ field, label }) => ({
    color: form.watch(field),
    label,
    field,
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Brand Colors</h3>
      <ColorGrid
        colors={brandColors}
        onColorClick={(color) => {
          const field = brandColors.find((c) => c.color === color)?.field;
          if (field) {
            document.getElementById(field)?.click();
          }
        }}
      />
      {brandColors.map(({ field, color }) => (
        <Input
          key={field}
          id={field}
          type="color"
          value={color}
          onChange={(e) => onColorChange(field, e.target.value)}
          className="sr-only"
        />
      ))}
    </div>
  );
}