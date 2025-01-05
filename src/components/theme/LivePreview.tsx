import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewContent } from "./preview/PreviewContent";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

interface LivePreviewProps {
  storefrontId: string;
}

type StorefrontRow = Database['public']['Tables']['storefronts']['Row'];

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData>({});
  const [showContent, setShowContent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Lock scrolling when verification or instructions prompt is shown
    if (!showContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showContent]);

  useEffect(() => {
    const fetchStorefrontData = async () => {
      console.log("Fetching storefront data for preview:", storefrontId);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", storefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        return;
      }

      console.log("Fetched storefront data:", data);
      setPreviewData(data);

      // If no verification is required, show instructions or content directly
      if (data.verification_type === 'none') {
        setIsVerified(true);
        if (data.enable_instructions) {
          setShowInstructions(true);
        } else {
          setShowContent(true);
        }
      }
    };

    fetchStorefrontData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`storefront_changes_${storefrontId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'storefronts',
          filter: `id=eq.${storefrontId}`,
        },
        (payload) => {
          console.log("Received realtime update:", payload);
          const newData = payload.new as StorefrontRow;
          setPreviewData(newData);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [storefrontId]);

  const handleVerification = (password?: string) => {
    console.log("Handling verification...");
    if (previewData.verification_type === 'password' || previewData.verification_type === 'both') {
      if (password !== previewData.verification_password) {
        return;
      }
    }
    setIsVerified(true);
    if (previewData.enable_instructions) {
      console.log("Showing instructions after verification");
      setShowInstructions(true);
    } else {
      console.log("Showing content directly after verification");
      setShowContent(true);
    }
  };

  const handleContinue = () => {
    console.log("Continuing to content from instructions");
    setShowInstructions(false);
    setShowContent(true);
  };

  const handleReset = () => {
    console.log("Resetting preview state");
    setIsVerified(false);
    setShowContent(false);
    setShowInstructions(false);
  };

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-background">
      {!isVerified && previewData.verification_type !== 'none' && (
        <VerificationPrompt 
          previewData={previewData} 
          onVerify={handleVerification}
        />
      )}
      {isVerified && showInstructions && previewData.enable_instructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-[400px] rounded-lg shadow-xl bg-white p-6 space-y-6">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name} 
                className="h-16 mx-auto object-contain"
              />
            )}
            
            <h2 className="text-xl font-semibold text-center">
              Welcome to {previewData.name}
            </h2>
            
            <div 
              className="prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit space-y-4"
              dangerouslySetInnerHTML={{ __html: previewData.instructions_text || '' }}
            />

            <Button
              className="w-full"
              onClick={handleContinue}
              style={{ 
                backgroundColor: previewData.verification_button_color,
                color: previewData.verification_button_text_color,
                border: 'none'
              }}
            >
              Enter Site
            </Button>
          </div>
        </div>
      )}
      {((isVerified && showContent) || previewData.verification_type === 'none') && (
        <PreviewContent 
          previewData={previewData} 
          onReset={handleReset}
        />
      )}
    </div>
  );
}