import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./ColorPicker";
import { useEffect, useState } from "react";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  const [opacity, setOpacity] = useState<number>(30);
  const [color, setColor] = useState<string>("#FFFFFF");

  // Initialize values from form
  useEffect(() => {
    const currentValues = form.getValues();
    console.log("HeaderSettings - Initializing with form values:", {
      header_opacity: currentValues.header_opacity,
      header_color: currentValues.header_color
    });
    
    setOpacity(currentValues.header_opacity ?? 30);
    setColor(currentValues.header_color ?? "#FFFFFF");
  }, []);

  const handleOpacityChange = (value: string) => {
    const numValue = Math.min(Math.max(Number(value) || 0, 0), 100);
    console.log("HeaderSettings - Setting opacity to:", numValue);
    
    setOpacity(numValue);
    form.setValue("header_opacity", numValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const handleHeaderColorChange = (newColor: string) => {
    console.log("HeaderSettings - Setting color to:", newColor);
    
    setColor(newColor);
    form.setValue("header_color", newColor, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

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
                      value={opacity}
                      onChange={(e) => handleOpacityChange(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      {opacity}%
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
                    selectedColor={color}
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