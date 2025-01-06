import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./ColorPicker";
import { useEffect, useState } from "react";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  // Initialize state with form values or defaults
  const [opacity, setOpacity] = useState<number>(() => {
    const formValue = form.getValues("header_opacity");
    console.log("Initial header_opacity from form:", formValue);
    return typeof formValue === 'number' ? formValue : 30;
  });

  const [color, setColor] = useState<string>(() => {
    const formValue = form.getValues("header_color");
    console.log("Initial header_color from form:", formValue);
    return formValue || "#FFFFFF";
  });

  const handleOpacityChange = (value: string) => {
    // Convert to number and clamp between 0 and 100
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