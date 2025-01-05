import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";
import { BrowserAssets } from "./appearance/BrowserAssets";
import { LivePreview } from "../theme/LivePreview";
import { useParams } from "react-router-dom";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const storefrontId = localStorage.getItem('lastStorefrontId');

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <BrowserAssets form={form} />
          <ColorManagement 
            form={form} 
            storefrontId={storefrontId} 
            logoUrl={form.watch("logo_url")} 
          />
        </div>
        
        <div className="sticky top-4 h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background shadow">
          <div className="h-full w-full">
            {storefrontId && (
              <LivePreview storefrontId={storefrontId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}