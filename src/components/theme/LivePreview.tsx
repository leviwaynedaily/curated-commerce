import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeConfig } from "@/types/theme";

interface LivePreviewProps {
  storefrontId: string;
}

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<{
    name?: string;
    description?: string;
    logo_url?: string;
    theme_config?: ThemeConfig;
  }>({});

  useEffect(() => {
    // Initial data fetch
    const fetchStorefrontData = async () => {
      console.log("Fetching storefront data for preview:", storefrontId);
      const { data, error } = await supabase
        .from("storefronts")
        .select("name, description, logo_url, theme_config")
        .eq("id", storefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        return;
      }

      // Cast the theme_config to ThemeConfig type
      const themeConfig = data.theme_config as ThemeConfig;
      setPreviewData({
        name: data.name,
        description: data.description,
        logo_url: data.logo_url,
        theme_config: themeConfig
      });
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
          const newData = payload.new;
          setPreviewData({
            name: newData.name,
            description: newData.description,
            logo_url: newData.logo_url,
            theme_config: newData.theme_config as ThemeConfig
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [storefrontId]);

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