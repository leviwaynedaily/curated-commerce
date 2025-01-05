import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface StorefrontVerificationProps {
  form: UseFormReturn<any>;
}

export function StorefrontVerification({ form }: StorefrontVerificationProps) {
  const verificationType = form.watch("verification_type");
  const hasAgeVerification = verificationType === "age" || verificationType === "both";
  const hasPasswordProtection = verificationType === "password" || verificationType === "both";
  const isVerificationEnabled = verificationType !== "none";

  const handleVerificationToggle = (enabled: boolean) => {
    // If enabling, set to "age" as default, if disabling set to "none"
    form.setValue("verification_type", enabled ? "age" : "none");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Verification Settings</h2>
        <FormItem className="flex items-center space-x-2">
          <FormLabel className="text-sm text-muted-foreground">Enable verification prompt</FormLabel>
          <FormControl>
            <Switch
              checked={isVerificationEnabled}
              onCheckedChange={handleVerificationToggle}
            />
          </FormControl>
        </FormItem>
      </div>

      {isVerificationEnabled && (
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

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="verification_age"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel>Age Verification</FormLabel>
                      <FormDescription>
                        Require visitors to confirm they are of legal age
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={hasAgeVerification}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue("verification_type", hasPasswordProtection ? "both" : "age");
                          } else {
                            form.setValue("verification_type", hasPasswordProtection ? "password" : "none");
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  {hasAgeVerification && (
                    <FormField
                      control={form.control}
                      name="verification_age_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Verification Text</FormLabel>
                          <FormControl>
                            <RichTextEditor value={field.value || ''} onChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verification_password"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel>Password Protection</FormLabel>
                      <FormDescription>
                        Protect your storefront with a password
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={hasPasswordProtection}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue("verification_type", hasAgeVerification ? "both" : "password");
                          } else {
                            form.setValue("verification_type", hasAgeVerification ? "age" : "none");
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  {hasPasswordProtection && (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="verification_legal_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Legal Text</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value || ''} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}