import { UseFormReturn } from "react-hook-form";

interface BrowserAssetsProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
}

export function BrowserAssets({ form, storefrontId }: BrowserAssetsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Browser Assets</h4>
      <p className="text-sm text-muted-foreground">
        The favicon has been moved to the Basic Information section for easier access.
      </p>
    </div>
  );
}