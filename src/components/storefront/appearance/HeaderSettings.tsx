import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./ColorPicker";
import { useEffect } from "react";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  // Watch for changes in header opacity and color
  const currentOpacity = form.watch("header_opacity");
  const currentColor = form.watch("header_color");

  console.log("HeaderSettings - Initial values:", { currentOpacity, currentColor });

  const handleOpacityChange = (value: string) => {
    // Convert to number and clamp between 0 and 100
    const numValue = Math.min(Math.max(Number(value) || 0, 0), 100);
    console.log("HeaderSettings - Setting opacity to:", numValue);
    
    form.setValue("header_opacity", numValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const handleHeaderColorChange = (color: string) => {
    console.log("HeaderSettings - Setting color to:", color);
    
    form.setValue("header_color", color, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  // Log when form values change
  useEffect(() => {
    console.log("HeaderSettings - Form values updated:", {
      opacity: currentOpacity,
      color: currentColor
    });
  }, [currentOpacity, currentColor]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <div className="grid gap-4">
        <div className="flex items-start gap-6">
          <FormField
            control={form.control}
            name="header_opacity"
            render={() => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={currentOpacity ?? 30}
                      onChange={(e) => handleOpacityChange(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      {currentOpacity ?? 30}%
                    </span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="header_color"
            render={() => (
              <FormItem className="flex-1">
                <FormControl>
                  <ColorPicker
                    colors={[]}
                    selectedColor={currentColor ?? "#FFFFFF"}
                    onColorSelect={handleHeaderColorChange}
                    label=""
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