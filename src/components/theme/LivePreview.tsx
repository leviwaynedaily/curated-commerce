import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewContent } from "./preview/PreviewContent";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LivePreviewProps {
  storefrontId: string;
}

type StorefrontRow = Database['public']['Tables']['storefronts']['Row'];

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
        console.log("Store slug:", data.slug);
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
  }, [storefrontId]);

  const handleLogoClick = () => {
    console.log("Logo clicked, resetting verification state");
    handleReset();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4 p-4">
          <h2 className="text-2xl font-semibold text-foreground">{error}</h2>
          <p className="text-muted-foreground">
            Please check the URL or contact the store owner.
          </p>
        </div>
      </div>
    );
  }

  if (!previewData || Object.keys(previewData).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="h-full w-full flex items-center justify-center p-4">
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
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Enter Site
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function handleVerification(password?: string) {
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
  }

  function handleContinue() {
    console.log("Continuing to content from instructions");
    setShowInstructions(false);
    setShowContent(true);
  }

  function handleReset() {
    console.log("Resetting preview state");
    setIsVerified(false);
    setShowContent(false);
    setShowInstructions(false);
  }
}