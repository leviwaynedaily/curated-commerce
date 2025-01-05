import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ImageUpload } from "../ImageUpload";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface BrowserAssetsProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
}

export function BrowserAssets({ form, storefrontId }: BrowserAssetsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async (field: string, value: string | null) => {
    if (!storefrontId) return;

    console.log("Saving browser asset:", field, value);

    try {
      const { error } = await supabase
        .from("storefronts")
        .update({ [field]: value })
        .eq("id", storefrontId);

      if (error) throw error;

      // Invalidate the storefront query to refresh the data
      await queryClient.invalidateQueries({ queryKey: ["storefront", storefrontId] });

      toast({
        title: "Success",
        description: "Changes saved automatically",
      });
    } catch (error) {
      console.error("Error saving browser asset:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

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
                onChange={(url) => {
                  field.onChange(url);
                  handleSave("favicon_url", url);
                }}
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