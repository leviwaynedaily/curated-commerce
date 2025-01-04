import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";

interface StorefrontVerificationProps {
  form: UseFormReturn<any>;
}

export function StorefrontVerification({ form }: StorefrontVerificationProps) {
  const verificationType = form.watch("verification_type");
  const showVerificationOptions = verificationType !== "none";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Verification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure age verification and password protection settings.
        </p>
      </div>

      <FormField
        control={form.control}
        name="verification_type"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Verification Prompt</FormLabel>
              <FormDescription>
                Require visitors to verify their age or enter a password
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value !== "none"}
                onCheckedChange={(checked) => {
                  field.onChange(checked ? "age" : "none");
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showVerificationOptions && (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="verification_logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Logo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    bucket="storefront-assets"
                    path="verification-logos"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_age"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={verificationType === "age" || verificationType === "both"}
                    onCheckedChange={(checked) => {
                      const currentType = form.getValues("verification_type");
                      if (checked) {
                        form.setValue("verification_type", currentType === "password" ? "both" : "age");
                      } else {
                        form.setValue("verification_type", currentType === "both" ? "password" : "none");
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Age Verification</FormLabel>
                  <FormDescription>
                    Require visitors to confirm they are of legal age
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_age_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Verification Text</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Protection</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const hasPassword = e.target.value.length > 0;
                      const currentType = form.getValues("verification_type");
                      if (hasPassword) {
                        form.setValue("verification_type", currentType === "age" ? "both" : "password");
                      } else {
                        form.setValue("verification_type", currentType === "both" ? "age" : "none");
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_legal_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Legal Text</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}