import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewContent } from "./preview/PreviewContent";
import { Database } from "@/integrations/supabase/types";

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
    // Lock scrolling when verification prompt is shown
    if (!isVerified) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVerified]);

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
    if (previewData.verification_type === 'password' || previewData.verification_type === 'both') {
      if (password !== previewData.verification_password) {
        return;
      }
    }
    setIsVerified(true);
    if (previewData.enable_instructions) {
      setShowInstructions(true);
    } else {
      setShowContent(true);
    }
  };

  const handleContinue = () => {
    setShowInstructions(false);
    setShowContent(true);
  };

  const handleReset = () => {
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
          <div className="w-[280px] rounded-lg shadow-xl bg-card p-4 space-y-4">
            <div 
              className="prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
              dangerouslySetInnerHTML={{ __html: previewData.instructions_text || '' }}
            />
            <button
              className="w-full h-7 text-xs rounded"
              onClick={handleContinue}
              style={{ 
                backgroundColor: previewData.verification_button_color,
                color: previewData.verification_button_text_color,
                border: 'none'
              }}
            >
              Continue to Site
            </button>
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