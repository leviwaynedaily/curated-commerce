import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const storefrontId = localStorage.getItem('lastStorefrontId');
  const navigate = useNavigate();

  if (!storefrontId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No storefront selected. Please select a storefront first.
        </AlertDescription>
      </Alert>
    );
  }

  const handleOpenPreview = () => {
    // Get the current origin (protocol + hostname + port)
    const origin = window.location.origin;
    // Construct the full preview URL
    const previewUrl = `${origin}/preview?storefrontId=${storefrontId}`;
    console.log("Opening preview window with URL:", previewUrl);
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button 
          onClick={handleOpenPreview}
          variant="outline"
        >
          Open Preview Window
        </Button>
      </div>
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