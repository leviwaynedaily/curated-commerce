import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="header_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header Color</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    {...field}
                    value={field.value || "#FFFFFF"}
                    className="w-24 h-10"
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.value || "#FFFFFF"}
                  </span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="header_opacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header Opacity (%)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...field}
                    value={field.value ?? 30}
                    onChange={(e) => {
                      const numValue = Math.min(Math.max(Number(e.target.value), 0), 100);
                      field.onChange(numValue);
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
      </div>
    </div>
  );
}