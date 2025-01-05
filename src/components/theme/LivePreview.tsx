import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewContent } from "./preview/PreviewContent";
import { Database } from "@/integrations/supabase/types";
import { ThemeConfig } from "@/types/theme";

interface LivePreviewProps {
  storefrontId: string;
}

type StorefrontRow = Database['public']['Tables']['storefronts']['Row'];

// Helper function to validate theme config
const validateThemeConfig = (config: unknown): ThemeConfig => {
  if (typeof config !== 'object' || !config) {
    throw new Error('Invalid theme config');
  }

  const themeConfig = config as any;
  
  if (!themeConfig.colors?.background?.primary ||
      !themeConfig.colors?.background?.secondary ||
      !themeConfig.colors?.background?.accent ||
      !themeConfig.colors?.font?.primary ||
      !themeConfig.colors?.font?.secondary ||
      !themeConfig.colors?.font?.highlight) {
    console.error('Invalid theme config structure:', themeConfig);
    // Return default theme config
    return {
      colors: {
        background: {
          primary: "#000000",
          secondary: "#f5f5f5",
          accent: "#56b533"
        },
        font: {
          primary: "#ffffff",
          secondary: "#cccccc",
          highlight: "#ee459a"
        }
      }
    };
  }

  return themeConfig as ThemeConfig;
};

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
      // Convert the raw data to PreviewData type
      const convertedData: PreviewData = {
        id: data.id,
        name: data.name,
        description: data.description,
        logo_url: data.logo_url,
        theme_config: validateThemeConfig(data.theme_config),
        verification_type: data.verification_type,
        verification_age_text: data.verification_age_text,
        verification_legal_text: data.verification_legal_text,
        verification_logo_url: data.verification_logo_url,
        verification_password: data.verification_password,
        enable_instructions: data.enable_instructions,
        instructions_text: data.instructions_text,
        show_description: data.show_description,
      };
      setPreviewData(convertedData);
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
          // Convert the payload data to PreviewData type
          const convertedData: PreviewData = {
            id: newData.id,
            name: newData.name,
            description: newData.description,
            logo_url: newData.logo_url,
            theme_config: validateThemeConfig(newData.theme_config),
            verification_type: newData.verification_type,
            verification_age_text: newData.verification_age_text,
            verification_legal_text: newData.verification_legal_text,
            verification_logo_url: newData.verification_logo_url,
            verification_password: newData.verification_password,
            enable_instructions: newData.enable_instructions,
            instructions_text: newData.instructions_text,
            show_description: newData.show_description,
          };
          setPreviewData(convertedData);
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

  if (!previewData.theme_config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { colors } = previewData.theme_config;

  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Always render the content */}
      <div className={`${!isVerified ? 'filter blur-lg' : ''}`}>
        <PreviewContent 
          previewData={previewData} 
          colors={colors} 
          onReset={handleReset}
        />
      </div>

      {/* Overlay verification prompt if not verified */}
      {!isVerified && previewData.verification_type !== 'none' && (
        <VerificationPrompt 
          previewData={previewData}
          onVerify={handleVerification}
          colors={colors}
        />
      )}

      {/* Show instructions if needed */}
      {isVerified && !showContent && showInstructions && previewData.enable_instructions && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: `${colors.background.primary}40` }}
        >
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div 
            className="relative max-w-md w-full p-6 rounded-lg"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <h2 
              className="text-xl font-bold mb-4"
              style={{ color: colors.font.primary }}
            >
              Instructions
            </h2>
            <div 
              className="prose prose-sm mb-6 max-w-none [&_a]:text-blue-500 [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
              style={{ color: colors.font.secondary }}
              dangerouslySetInnerHTML={{ __html: previewData.instructions_text || '' }}
            />
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
      )}
    </div>
  );
}
