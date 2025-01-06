import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <FormField
        control={form.control}
        name="header_opacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Header Opacity</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value ?? 30]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {field.value ?? 30}%
                </span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}