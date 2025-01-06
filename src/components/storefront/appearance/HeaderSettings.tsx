import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorGrid } from "./ColorGrid";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  const headerSettings = [
    { 
      field: "header_color", 
      label: "Header Color", 
      color: form.watch("header_color")
    },
  ];

  console.log("HeaderSettings - Current header color:", form.watch("header_color"));
  console.log("HeaderSettings - Current header opacity:", form.watch("header_opacity"));

  const handleColorChange = (color: string, field: string) => {
    console.log(`HeaderSettings - Setting ${field} to:`, color);
    form.setValue(field, color, {
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
                    value={form.watch("header_opacity")}
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
                    {form.watch("header_opacity")}%
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
              onChange={(e) => handleColorChange(e.target.value, field)}
              className="sr-only"
            />
          ))}
        </div>
      </div>
    </div>
  );
}