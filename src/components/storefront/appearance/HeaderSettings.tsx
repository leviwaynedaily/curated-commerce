import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./ColorPicker";
import { useEffect } from "react";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  const handleOpacityChange = (value: string) => {
    // Convert to number and clamp between 0 and 100
    const numValue = Math.min(Math.max(Number(value) || 0, 0), 100);
    console.log("Setting header opacity to:", numValue);
    form.setValue("header_opacity", numValue, { 
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true 
    });
  };

  const handleHeaderColorChange = (color: string) => {
    console.log("Setting header color to:", color);
    form.setValue("header_color", color, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  // Watch for changes in header opacity and color
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "header_opacity" || name === "header_color") {
        console.log(`Header setting changed - ${name}:`, value[name]);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <div className="grid gap-4">
        <div className="flex items-start gap-6">
          <FormField
            control={form.control}
            name="header_opacity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Header Opacity (%)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={field.value}
                      onChange={(e) => handleOpacityChange(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value}%
                    </span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="header_color"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <ColorPicker
                    colors={[]}
                    selectedColor={field.value}
                    onColorSelect={handleHeaderColorChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}