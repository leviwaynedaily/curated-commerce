import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface StorefrontBasicInfoProps {
  form: UseFormReturn<any>;
}

export function StorefrontBasicInfo({ form }: StorefrontBasicInfoProps) {
  // Get the current storefront ID from localStorage
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  // Fetch current storefront data
  const { data: storefront } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      console.log("Fetching storefront data for:", currentStorefrontId);
      if (!currentStorefrontId) return null;

      const { data, error } = await supabase
        .from("storefronts")
        .select("name")
        .eq("id", currentStorefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Fetched storefront data:", data);
      return data;
    },
    enabled: !!currentStorefrontId
  });

  // Set the default value for the name field when storefront data is loaded
  useEffect(() => {
    if (storefront?.name && !form.getValues("name")) {
      console.log("Setting default name to:", storefront.name);
      form.setValue("name", storefront.name);
    }
  }, [storefront, form]);

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
              <Input placeholder={storefront?.name || "Enter site name"} {...field} />
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
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}