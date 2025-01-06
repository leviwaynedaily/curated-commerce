import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";

interface PWAIconUploadProps {
  form: UseFormReturn<any>;
  name: string;
  size: string;
  description: string;
}

export function PWAIconUpload({ form, name, size, description }: PWAIconUploadProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{size} Icon</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
      <ImageUpload
        value={form.watch(name)}
        onChange={(url) => {
          console.log(`Setting ${name} to:`, url);
          form.setValue(name, url);
        }}
        bucket="storefront-assets"
        path={`pwa/icons/${size}`}
        storefrontId={localStorage.getItem('lastStorefrontId') || undefined}
      />
    </div>
  );
}