import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";

interface PWAIconsProps {
  form: UseFormReturn<any>;
}

export function PWAIcons({ form }: PWAIconsProps) {
  const iconSizes = [
    { name: "icon_72x72", size: "72x72" },
    { name: "icon_96x96", size: "96x96" },
    { name: "icon_128x128", size: "128x128" },
    { name: "icon_144x144", size: "144x144" },
    { name: "icon_152x152", size: "152x152" },
    { name: "icon_192x192", size: "192x192" },
    { name: "icon_384x384", size: "384x384" },
    { name: "icon_512x512", size: "512x512" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">App Icons</h2>
        <p className="text-sm text-muted-foreground">
          Upload icons for different device sizes
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {iconSizes.map(({ name, size }) => (
          <div key={name} className="space-y-2">
            <h3 className="text-sm font-medium">{size} Icon</h3>
            <ImageUpload
              value={form.watch(name)}
              onChange={(url) => form.setValue(name, url)}
              bucket="storefront-assets"
              path={`pwa/icons/${size}`}
              storefrontId={localStorage.getItem('lastStorefrontId') || undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}