import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const storefrontId = localStorage.getItem('lastStorefrontId');

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <ColorManagement 
          form={form} 
          storefrontId={storefrontId} 
          logoUrl={form.watch("logo_url")} 
        />
      </div>
    </div>
  );
}