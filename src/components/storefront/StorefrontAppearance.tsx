import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { BrowserAssets } from "./appearance/BrowserAssets";

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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <BrowserAssets form={form} storefrontId={currentStorefrontId} />
        </div>
      </div>
    </div>
  );
}