import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const [previewColors, setPreviewColors] = useState(form.getValues("theme_config.colors"));

  // Update preview colors when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.theme_config?.colors) {
        setPreviewColors(value.theme_config.colors);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const ColorInput = ({ label, path }: { label: string; path: string }) => (
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize your storefront's colors and appearance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="mb-4 text-sm font-medium">Background Colors</h3>
            <div className="space-y-4">
              <ColorInput label="Primary Background" path="background.primary" />
              <ColorInput label="Secondary Background" path="background.secondary" />
              <ColorInput label="Accent Background" path="background.accent" />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-sm font-medium">Font Colors</h3>
            <div className="space-y-4">
              <ColorInput label="Primary Font" path="font.primary" />
              <ColorInput label="Secondary Font" path="font.secondary" />
              <ColorInput label="Highlight Font" path="font.highlight" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium">Live Preview</h3>
          <Card className="overflow-hidden">
            <div
              style={{ backgroundColor: previewColors?.background?.primary }}
              className="p-6"
            >
              <div
                style={{ backgroundColor: previewColors?.background?.secondary }}
                className="rounded-lg p-4"
              >
                <h4
                  style={{ color: previewColors?.font?.primary }}
                  className="mb-2 text-lg font-semibold"
                >
                  Preview Heading
                </h4>
                <p
                  style={{ color: previewColors?.font?.secondary }}
                  className="mb-4 text-sm"
                >
                  This is how your content will look with the selected colors.
                </p>
                <button
                  style={{
                    backgroundColor: previewColors?.background?.accent,
                    color: previewColors?.font?.primary,
                  }}
                  className="rounded px-4 py-2 text-sm font-medium"
                >
                  Sample Button
                </button>
                <p
                  style={{ color: previewColors?.font?.highlight }}
                  className="mt-4 text-sm font-medium"
                >
                  Highlighted text example
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}