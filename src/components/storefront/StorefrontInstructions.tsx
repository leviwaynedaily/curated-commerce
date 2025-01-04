import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface StorefrontInstructionsProps {
  form: UseFormReturn<any>;
}

export function StorefrontInstructions({ form }: StorefrontInstructionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Instructions Settings</h2>
        <FormField
          control={form.control}
          name="enable_instructions"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel className="text-sm text-muted-foreground">Enable instructions prompt</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}