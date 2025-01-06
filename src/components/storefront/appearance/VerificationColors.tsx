import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ColorGrid } from "./ColorGrid";

interface VerificationColorsProps {
  form: UseFormReturn<any>;
  onColorChange: (field: string, value: string) => void;
}

export function VerificationColors({ form, onColorChange }: VerificationColorsProps) {
  const verificationColors = [
    { field: "verification_button_color", label: "Button Color", defaultValue: "#D946EF" },
    { field: "verification_button_text_color", label: "Button Text", defaultValue: "#FFFFFF" },
    { field: "verification_text_color", label: "Text Color", defaultValue: "#1A1F2C" },
    { field: "verification_checkbox_color", label: "Checkbox Color", defaultValue: "#D946EF" },
    { field: "verification_input_border_color", label: "Input Border", defaultValue: "#E5E7EB" },
    { field: "verification_next_text_color", label: "Next Button Text", defaultValue: "#4CAF50" },
    { field: "verification_modal_background_color", label: "Modal Background", defaultValue: "#FFFFFF" },
  ].map(({ field, label, defaultValue }) => ({
    color: form.watch(field) || defaultValue,
    label,
    field,
  }));

  console.log("Verification colors being rendered:", verificationColors);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Verification Colors</h3>
      <ColorGrid
        colors={verificationColors}
        onColorClick={(color, field) => {
          console.log(`Color grid clicked - color: ${color}, field: ${field}`);
          if (field) {
            const inputElement = document.getElementById(field);
            if (inputElement) {
              console.log(`Triggering click on input for field: ${field}`);
              inputElement.click();
            }
          }
        }}
      />
      {verificationColors.map(({ field, color }) => (
        <Input
          key={field}
          id={field}
          type="color"
          value={color}
          onChange={(e) => {
            console.log(`Color input changed - field: ${field}, value: ${e.target.value}`);
            onColorChange(field, e.target.value);
          }}
          className="sr-only"
        />
      ))}
    </div>
  );
}