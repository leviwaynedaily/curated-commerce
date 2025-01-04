import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ColorInputProps {
  label: string;
  path: string;
  form: UseFormReturn<any>;
}

export function ColorInput({ label, path, form }: ColorInputProps) {
  return (
    <FormField
      control={form.control}
      name={`theme_config.colors.${path}`}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="h-6 w-6 rounded-md border"
              style={{ backgroundColor: field.value }}
            />
            <Input
              type="color"
              {...field}
              className="w-12 cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
            />
          </div>
        </FormItem>
      )}
    />
  );
}