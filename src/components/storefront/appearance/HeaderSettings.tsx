import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  const handleOpacityChange = (value: string) => {
    // Convert to number and clamp between 0 and 100
    const numValue = Math.min(Math.max(Number(value) || 0, 0), 100);
    form.setValue("header_opacity", numValue, { shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <FormField
        control={form.control}
        name="header_opacity"
        defaultValue={30}
        render={({ field }) => (
          <FormItem>
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
    </div>
  );
}