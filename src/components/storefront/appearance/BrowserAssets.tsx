import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ImageUpload } from "../ImageUpload";
import { UseFormReturn } from "react-hook-form";

interface BrowserAssetsProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
}

export function BrowserAssets({ form, storefrontId }: BrowserAssetsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Browser Assets</h4>
      <FormField
        control={form.control}
        name="favicon_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Favicon</FormLabel>
            <div className="flex items-start gap-4">
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                bucket="storefront-assets"
                path="favicons"
                storefrontId={storefrontId || undefined}
              />
              {field.value && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Current favicon:</p>
                  <img
                    src={field.value}
                    alt="Current favicon"
                    className="h-8 w-8"
                  />
                </div>
              )}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}