import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface StorefrontInstructionsProps {
  form: UseFormReturn<any>;
}

export function StorefrontInstructions({ form }: StorefrontInstructionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Instructions Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure instructions prompt settings.
        </p>
      </div>

      <FormField
        control={form.control}
        name="enable_instructions"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Instructions Prompt</FormLabel>
              <FormDescription>
                Show instructions to visitors when they enter your store
              </FormDescription>
            </div>
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
  );
}