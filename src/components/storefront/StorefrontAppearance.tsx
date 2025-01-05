import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface StorefrontAppearanceProps {
  form: UseFormReturn<any>;
}

export function StorefrontAppearance({ form }: StorefrontAppearanceProps) {
  const storefrontId = localStorage.getItem('lastStorefrontId');
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null);

  useEffect(() => {
    return () => {
      if (previewWindow) {
        previewWindow.close();
      }
    };
  }, [previewWindow]);

  const openPreviewWindow = () => {
    if (previewWindow) {
      previewWindow.close();
    }

    const newWindow = window.open(
      `/preview?storefrontId=${storefrontId}`,
      'StorefrontPreview',
      'width=390,height=844,resizable=yes'
    );
    
    setPreviewWindow(newWindow);
  };

  return (
    <div className="space-y-8">
      <Button 
        onClick={openPreviewWindow}
        className="w-full mb-8"
        variant="outline"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Open Preview Window
      </Button>

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