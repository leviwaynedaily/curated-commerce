import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const storefrontId = localStorage.getItem('lastStorefrontId');
  const navigate = useNavigate();

  const handleOpenPreview = () => {
    if (storefrontId) {
      window.open(`/preview?storefrontId=${storefrontId}`, '_blank');
    }
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