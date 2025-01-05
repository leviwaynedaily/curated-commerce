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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip verification in preview mode
  if (!isVerified) {
    handleVerification();
  }

  return (
    <div className="h-screen overflow-auto bg-background">
      <PreviewContent 
        previewData={previewData} 
        onReset={handleReset}
      />
    </div>
  );
}