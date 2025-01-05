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
    setIsVerified(true);
    if (previewData.enable_instructions) {
      setShowInstructions(true);
    } else {
      setShowContent(true);
    }
  };

  const handleContinue = () => {
    setShowContent(true);
  };

  const handleReset = () => {
    setIsVerified(false);
    setShowContent(false);
    setShowInstructions(false);
  };

  if (!previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background">
      {/* Always render the content */}
      <div className={`${!isVerified ? 'filter blur-lg' : ''}`}>
        <PreviewContent 
          previewData={previewData} 
          onReset={handleReset}
        />
      </div>

      {/* Overlay verification prompt if not verified */}
      {!isVerified && previewData.verification_type !== 'none' && (
        <VerificationPrompt 
          previewData={previewData}
          onVerify={handleVerification}
        />
      )}

      {/* Show instructions if needed */}
      {isVerified && !showContent && showInstructions && previewData.enable_instructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40">
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="relative max-w-md w-full p-6 rounded-lg bg-card">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <div 
              className="prose prose-sm mb-6 max-w-none [&_a]:text-blue-500 [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
              dangerouslySetInnerHTML={{ __html: previewData.instructions_text || '' }}
            />
            <button 
              className="w-full px-4 py-2 rounded bg-primary text-primary-foreground"
              onClick={handleContinue}
            >
              Continue to Site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}