import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface StorefrontBasicInfoProps {
  form: UseFormReturn<any>;
}

export function StorefrontBasicInfo({ form }: StorefrontBasicInfoProps) {
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Basic Information</h2>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter site name" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Storefront Logo</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                bucket="storefront-assets"
                path="logos"
                storefrontId={currentStorefrontId || undefined}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>Storefront Description</FormLabel>
          <FormField
            control={form.control}
            name="show_description"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel className="text-sm text-muted-foreground">Display on storefront</FormLabel>
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor 
                  value={field.value || ''} 
                  onChange={(value) => {
                    console.log("Description changed to:", value);
                    field.onChange(value);
                  }} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}