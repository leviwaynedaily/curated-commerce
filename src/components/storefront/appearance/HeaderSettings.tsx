import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorGrid } from "./ColorGrid";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  const headerSettings = [
    { field: "header_color", label: "Header Color", defaultValue: "#FFFFFF" },
  ].map(({ field, label, defaultValue }) => ({
    color: form.watch(field) || defaultValue,
    label,
    field,
  }));

  console.log("HeaderSettings being rendered:", headerSettings);

  const handleColorChange = (field: string, value: string) => {
    console.log(`HeaderSettings - Setting ${field} to:`, value);
    form.setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="header_opacity"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={form.watch("header_opacity") ?? 30}
                    onChange={(e) => {
                      const numValue = Math.min(Math.max(Number(e.target.value) || 0, 0), 100);
                      console.log("HeaderSettings - Setting opacity to:", numValue);
                      form.setValue("header_opacity", numValue, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true
                      });
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.watch("header_opacity") ?? 30}%
                  </span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <ColorGrid
            colors={headerSettings}
            onColorClick={(color, field) => {
              if (field) {
                const inputElement = document.getElementById(field);
                if (inputElement) {
                  console.log(`Triggering click on input for field: ${field}`);
                  inputElement.click();
                }
              }
            }}
          />
          {headerSettings.map(({ field, color }) => (
            <Input
              key={field}
              id={field}
              type="color"
              value={color}
              onChange={(e) => handleColorChange(field, e.target.value)}
              className="sr-only"
            />
          ))}
        </div>
      </div>
    </div>
  );
}