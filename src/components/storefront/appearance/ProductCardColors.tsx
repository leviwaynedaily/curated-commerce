import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ColorGrid } from "./ColorGrid";

interface ProductCardColorsProps {
  form: UseFormReturn<any>;
  onColorChange: (field: string, value: string) => void;
}

export function ProductCardColors({ form, onColorChange }: ProductCardColorsProps) {
  const productCardColors = [
    { field: "product_card_background_color", label: "Card Background" },
    { field: "product_title_text_color", label: "Title Text" },
    { field: "product_description_text_color", label: "Description Text" },
    { field: "product_price_color", label: "Price Text" },
    { field: "product_price_button_color", label: "Price Button" },
    { field: "product_category_background_color", label: "Category Background" },
    { field: "product_category_text_color", label: "Category Text" },
  ].map(({ field, label }) => ({
    color: form.watch(field),
    label,
    field,
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Product Card Colors</h3>
      <ColorGrid
        colors={productCardColors}
        onColorClick={(color) => {
          const field = productCardColors.find((c) => c.color === color)?.field;
          if (field) {
            document.getElementById(field)?.click();
          }
        }}
      />
      {productCardColors.map(({ field, color }) => (
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