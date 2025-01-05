import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";
import { BrowserAssets } from "./appearance/BrowserAssets";
import { LivePreview } from "../theme/LivePreview";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const storefrontId = localStorage.getItem('lastStorefrontId');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Storefront Appearance</h1>
        <p className="text-muted-foreground mt-2">
          Customize how your storefront looks. Changes are saved automatically.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
        <div className="space-y-8">
          <BrowserAssets form={form} storefrontId={storefrontId} />
          <ColorManagement 
            form={form} 
            storefrontId={storefrontId} 
            logoUrl={form.watch("logo_url")} 
          />
        </div>
        
        <div className="relative hidden lg:block">
          <div className="sticky top-4 overflow-hidden rounded-lg border bg-background shadow">
            <div className="aspect-[9/16] w-full">
              {storefrontId && (
                <LivePreview storefrontId={storefrontId} />
              )}
            </div>
          </div>
        </div>

        {/* Show preview below on mobile */}
        <div className="lg:hidden">
          <div className="overflow-hidden rounded-lg border bg-background shadow">
            <div className="aspect-[9/16] w-full max-w-[300px] mx-auto">
              {storefrontId && (
                <LivePreview storefrontId={storefrontId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}