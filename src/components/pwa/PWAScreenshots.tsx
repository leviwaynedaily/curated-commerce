import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/storefront/ImageUpload";

interface PWAScreenshotsProps {
  form: UseFormReturn<any>;
}

export function PWAScreenshots({ form }: PWAScreenshotsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">App Screenshots</h2>
        <p className="text-sm text-muted-foreground">
          Upload screenshots of your app for different devices
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Mobile Screenshot</h3>
          <p className="text-xs text-muted-foreground">
            Recommended size: 360x640px
          </p>
          <ImageUpload
            value={form.watch("screenshot_mobile")}
            onChange={(url) => form.setValue("screenshot_mobile", url)}
            bucket="storefront-assets"
            path="pwa/screenshots/mobile"
            storefrontId={localStorage.getItem('lastStorefrontId') || undefined}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Desktop Screenshot</h3>
          <p className="text-xs text-muted-foreground">
            Recommended size: 1920x1080px
          </p>
          <ImageUpload
            value={form.watch("screenshot_desktop")}
            onChange={(url) => form.setValue("screenshot_desktop", url)}
            bucket="storefront-assets"
            path="pwa/screenshots/desktop"
            storefrontId={localStorage.getItem('lastStorefrontId') || undefined}
          />
        </div>
      </div>
    </div>
  );
}