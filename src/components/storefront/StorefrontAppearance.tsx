import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { BrowserAssets } from "./appearance/BrowserAssets";
import { ColorManagement } from "./appearance/ColorManagement";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize your storefront's appearance
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <BrowserAssets form={form} storefrontId={currentStorefrontId} />
        </div>

        <Separator />

        <div className="space-y-4">
          <ColorManagement 
            form={form} 
            storefrontId={currentStorefrontId}
            logoUrl={form.watch("logo_url")}
          />
        </div>
      </div>
    </div>
  );
}