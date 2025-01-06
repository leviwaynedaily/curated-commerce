import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HeaderSettingsProps {
  form: UseFormReturn<any>;
}

export function HeaderSettings({ form }: HeaderSettingsProps) {
  console.log("Current header values:", {
    header_color: form.watch("header_color"),
    header_opacity: form.watch("header_opacity")
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Header Settings</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Header Color</Label>
          <div className="flex items-center gap-4">
            <Input
              type="color"
              {...form.register("header_color")}
              className="w-24 h-10"
            />
            <span className="text-sm text-muted-foreground">
              {form.watch("header_color") || "#FFFFFF"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Header Opacity (%)</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={0}
              max={100}
              {...form.register("header_opacity", {
                valueAsNumber: true,
                value: form.watch("header_opacity") ?? 30
              })}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              {form.watch("header_opacity") ?? 30}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}