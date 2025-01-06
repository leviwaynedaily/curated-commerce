import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorGrid } from "./ColorGrid";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  // Get the values directly from the form
  const headerColor = form.getValues("header_color");
  const headerOpacity = form.getValues("header_opacity");

  console.log("HeaderSettings - Form values:", {
    headerColor,
    headerOpacity,
    allValues: form.getValues()
  });

  const headerSettings = [
    { 
      field: "header_color", 
      label: "Header Color", 
      color: headerColor || "#FFFFFF" // Ensure we always have a valid hex color
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="header_opacity"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={field.value ?? 30} // Default to 30 if undefined
                    onChange={(e) => {
                      const numValue = Math.min(Math.max(Number(e.target.value), 0), 100);
                      console.log("HeaderSettings - Setting opacity to:", numValue);
                      form.setValue("header_opacity", numValue, { 
                        shouldDirty: true 
                      });
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.value ?? 30}%
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
                console.log(`HeaderSettings - Color clicked: ${color} for field: ${field}`);
                form.setValue(field, color, { 
                  shouldDirty: true 
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}