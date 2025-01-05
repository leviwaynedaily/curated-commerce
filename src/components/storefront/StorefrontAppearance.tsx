import { UseFormReturn } from "react-hook-form";
import { ColorManagement } from "./appearance/ColorManagement";
import { BrowserAssets } from "./appearance/BrowserAssets";
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
    // Cleanup function to close preview window when component unmounts
    return () => {
      if (previewWindow) {
        previewWindow.close();
      }
    };
  }, [previewWindow]);

  const openPreviewWindow = () => {
    // Close existing window if it exists
    if (previewWindow) {
      previewWindow.close();
    }

    // Open new window
    const newWindow = window.open(
      `/preview?storefrontId=${storefrontId}`,
      'StorefrontPreview',
      'width=390,height=844,resizable=yes'
    );
    
    setPreviewWindow(newWindow);
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
        <div className="space-y-8">
          <BrowserAssets form={form} storefrontId={storefrontId} />
          <ColorManagement 
            form={form} 
            storefrontId={storefrontId} 
            logoUrl={form.watch("logo_url")} 
          />
        </div>
        
        <div className="sticky top-4">
          <Button 
            onClick={openPreviewWindow}
            className="w-full"
            variant="outline"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Preview Window
          </Button>
        </div>
      </div>
    </div>
  );
}