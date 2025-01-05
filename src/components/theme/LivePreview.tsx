import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeConfig } from "@/types/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PreviewData } from "@/types/preview";

interface LivePreviewProps {
  storefrontId: string;
}

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData>({});
  const [showContent, setShowContent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [password, setPassword] = useState("");
  const [ageVerified, setAgeVerified] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Safely cast theme_config to ThemeConfig
      const parsedData: PreviewData = {
        ...data,
        theme_config: data.theme_config as unknown as ThemeConfig
      };
      
      console.log("Parsed theme config:", parsedData.theme_config);
      setPreviewData(parsedData);
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
          const updatedData = payload.new;
          setPreviewData({
            ...updatedData,
            theme_config: updatedData.theme_config as unknown as ThemeConfig
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [storefrontId]);

  const handleVerification = () => {
    if (previewData.verification_type === 'password' || previewData.verification_type === 'both') {
      if (password !== previewData.verification_password) {
        setError("Incorrect password");
        return;
      }
      setPasswordVerified(true);
    }
    
    if (previewData.verification_type === 'age' || previewData.verification_type === 'both') {
      setAgeVerified(true);
    }

    const isVerified = 
      (previewData.verification_type === 'age' && ageVerified) ||
      (previewData.verification_type === 'password' && passwordVerified) ||
      (previewData.verification_type === 'both' && ageVerified && passwordVerified) ||
      previewData.verification_type === 'none';

    if (isVerified) {
      if (previewData.enable_instructions) {
        setShowInstructions(true);
      } else {
        setShowContent(true);
      }
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
        <div 
          className="max-w-md w-full p-6 rounded-lg"
          style={{ backgroundColor: colors.background.secondary }}
        >
          {previewData.verification_logo_url && (
            <img 
              src={previewData.verification_logo_url} 
              alt="Verification" 
              className="h-16 mx-auto mb-6"
            />
          )}
          
          {(previewData.verification_type === 'age' || previewData.verification_type === 'both') && !ageVerified && (
            <div className="space-y-4">
              <p style={{ color: colors.font.primary }}>{previewData.verification_age_text}</p>
              <Button 
                className="w-full"
                style={{
                  backgroundColor: colors.background.accent,
                  color: colors.font.primary
                }}
                onClick={() => setAgeVerified(true)}
              >
                Confirm Age
              </Button>
            </div>
          )}

          {(previewData.verification_type === 'password' || previewData.verification_type === 'both') && 
           ((previewData.verification_type === 'both' && ageVerified) || previewData.verification_type === 'password') && (
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          )}

          {((previewData.verification_type === 'password' && password) ||
            (previewData.verification_type === 'both' && ageVerified && password) ||
            (previewData.verification_type === 'age' && ageVerified)) && (
            <Button 
              className="w-full mt-4"
              style={{
                backgroundColor: colors.background.accent,
                color: colors.font.primary
              }}
              onClick={handleVerification}
            >
              Enter Site
            </Button>
          )}

          <p 
            className="mt-4 text-sm text-center"
            style={{ color: colors.font.secondary }}
          >
            {previewData.verification_legal_text}
          </p>
        </div>
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
          <Button 
            className="w-full"
            style={{
              backgroundColor: colors.background.accent,
              color: colors.font.primary
            }}
            onClick={handleContinue}
          >
            Continue to Site
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.primary }}
    >
      <header
        className="p-6 border-b"
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: `${colors.background.accent}22`
        }}
      >
        {previewData.logo_url && (
          <img 
            src={previewData.logo_url} 
            alt={previewData.name} 
            className="h-16 object-contain mb-4"
          />
        )}
        <h1 
          className="text-2xl font-bold"
          style={{ 
            color: colors.font.primary,
            background: colors.font.highlight.includes('gradient') 
              ? colors.font.highlight 
              : 'none',
            WebkitBackgroundClip: colors.font.highlight.includes('gradient') ? 'text' : 'none',
            WebkitTextFillColor: colors.font.highlight.includes('gradient') ? 'transparent' : colors.font.primary,
          }}
        >
          {previewData.name}
        </h1>
        {previewData.description && (
          <p 
            className="mt-2"
            style={{ color: colors.font.secondary }}
          >
            {previewData.description}
          </p>
        )}
      </header>

      <main className="p-6">
        <div 
          className="text-center"
          style={{ color: colors.font.primary }}
        >
          Live Preview Mode
        </div>
      </main>
    </div>
  );
}