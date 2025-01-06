import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewLoading } from "./preview/PreviewLoading";
import { PreviewError } from "./preview/PreviewError";
import { PreviewInstructions } from "./preview/PreviewInstructions";
import { toast } from "sonner";

interface LivePreviewProps {
  storefrontId: string;
}

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData>({});
  const [showContent, setShowContent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefrontData = async () => {
      try {
        console.log("Fetching storefront data for preview. ID:", storefrontId);
        
        const { data, error } = await supabase
          .from("storefronts")
          .select()
          .match({ id: storefrontId })
          .maybeSingle();

        console.log("Supabase response - Data:", data);
        console.log("Supabase response - Error:", error);

        if (error) {
          console.error("Error fetching storefront:", error);
          setError("An error occurred while loading the store.");
          toast.error("An error occurred while loading the store.");
          return;
        }

        if (!data) {
          console.error("No storefront found");
          setError("This store is not available.");
          toast.error("This store is not available.");
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
      } catch (err) {
        console.error("Failed to fetch storefront:", err);
        setError("An error occurred while loading the store.");
        toast.error("An error occurred while loading the store.");
      }
    };

    fetchStorefrontData();

    // Subscribe to real-time updates for the storefront
    const channel = supabase
      .channel('storefront-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'storefronts',
          filter: `id=eq.${storefrontId}`
        },
        (payload) => {
          console.log("Received real-time update:", payload);
          // Update the preview data with the new changes
          setPreviewData(prevData => ({
            ...prevData,
            ...payload.new
          }));
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [storefrontId]);

  const handleLogoClick = () => {
    console.log("Logo clicked, resetting verification state");
    handleReset();
  };

  const handleVerification = (password?: string) => {
    console.log("Handling verification...");
    if (previewData.verification_type === 'password' || previewData.verification_type === 'both') {
      if (password !== previewData.verification_password) {
        toast.error("Invalid password");
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

  if (error) {
    return <PreviewError error={error} />;
  }

  if (!previewData || Object.keys(previewData).length === 0) {
    return <PreviewLoading />;
  }

  return (
    <div className="h-screen w-full overflow-y-auto bg-background">
      {/* Main content area */}
      <div 
        className={`${(!isVerified || (isVerified && showInstructions)) ? 'blur-sm' : ''} transition-all duration-300`}
      >
        <PreviewContent 
          previewData={previewData} 
          onReset={handleReset}
          onLogoClick={handleLogoClick}
        />
      </div>

      {/* Verification overlay */}
      {!isVerified && previewData.verification_type !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="h-full w-full flex items-center justify-center p-4">
            <VerificationPrompt 
              previewData={previewData} 
              onVerify={handleVerification}
            />
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      {isVerified && showInstructions && previewData.enable_instructions && (
        <PreviewInstructions 
          previewData={previewData}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}