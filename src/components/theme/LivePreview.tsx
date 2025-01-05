import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewContent } from "./preview/PreviewContent";

interface LivePreviewProps {
  storefrontId: string;
}

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData>({});
  const [showContent, setShowContent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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
    };

    fetchStorefrontData();

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
          setPreviewData(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [storefrontId]);

  const handleVerification = (password?: string) => {
    if (previewData.enable_instructions) {
      setShowInstructions(true);
    } else {
      setShowContent(true);
    }
  };

  const handleContinue = () => {
    setShowContent(true);
  };

  if (!previewData.theme_config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { colors } = previewData.theme_config;

  if (!showContent && !showInstructions && previewData.verification_type !== 'none') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.background.primary }}
      >
        <VerificationPrompt 
          previewData={previewData}
          onVerify={handleVerification}
          colors={colors}
        />
      </div>
    );
  }

  if (!showContent && showInstructions && previewData.enable_instructions) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div 
          className="max-w-md w-full p-6 rounded-lg"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <h2 
            className="text-xl font-bold mb-4"
            style={{ color: colors.font.primary }}
          >
            Instructions
          </h2>
          <p 
            className="mb-6"
            style={{ color: colors.font.secondary }}
          >
            {previewData.instructions_text}
          </p>
          <button 
            className="w-full px-4 py-2 rounded"
            style={{
              backgroundColor: colors.background.accent,
              color: colors.font.primary
            }}
            onClick={handleContinue}
          >
            Continue to Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.primary }}
    >
      <PreviewContent previewData={previewData} colors={colors} />
    </div>
  );
}