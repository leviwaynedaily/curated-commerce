import { useSearchParams, useParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useStorefront } from "@/hooks/useStorefront";
import { PreviewError } from "@/components/theme/preview/PreviewError";
import { Loader2 } from "lucide-react";

export default function Preview() {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const [storefrontId, setStorefrontId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manifestData, setManifestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStorefrontId = async () => {
      try {
        // If storefrontId is in URL params, use that (preview mode)
        const idFromParams = searchParams.get('storefrontId');
        if (idFromParams) {
          console.log("Preview mode - Using storefront ID from URL:", idFromParams);
          setStorefrontId(idFromParams);
          return;
        }

        // Otherwise look up by slug (public access mode)
        if (slug) {
          console.log("Public access mode - Looking up storefront by slug:", slug);
          const { data, error } = await supabase
            .from("storefronts")
            .select("id")
            .eq("slug", slug)
            .eq("is_published", true)
            .maybeSingle();

          if (error) {
            console.error("Error fetching storefront:", error);
            setError("Store not found");
            return;
          }

          if (!data) {
            console.error("No storefront found for slug:", slug);
            setError("Store not found");
            return;
          }

          console.log("Found storefront ID for slug:", data.id);
          setStorefrontId(data.id);
        }
      } catch (err) {
        console.error("Error in getStorefrontId:", err);
        setError("Failed to load store");
      } finally {
        setIsLoading(false);
      }
    };

    getStorefrontId();
  }, [searchParams, slug]);

  // Fetch PWA settings when storefrontId is available
  useEffect(() => {
    const fetchPWASettings = async () => {
      if (!storefrontId) {
        console.log("No storefront ID available for PWA settings");
        return;
      }

      try {
        console.log("Fetching PWA settings for storefront:", storefrontId);
        const { data, error } = await supabase
          .from("pwa_settings")
          .select("*")
          .eq("storefront_id", storefrontId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching PWA settings:", error);
          return;
        }

        if (data) {
          console.log("Found PWA settings:", data);
          // Generate manifest data from PWA settings
          const manifestData = {
            name: data.name,
            short_name: data.short_name,
            description: data.description,
            start_url: data.start_url || "/",
            display: data.display || "standalone",
            orientation: data.orientation || "any",
            theme_color: data.theme_color || "#000000",
            background_color: data.background_color || "#ffffff",
            icons: [
              data.icon_72x72 && { src: data.icon_72x72, sizes: "72x72", type: "image/png" },
              data.icon_96x96 && { src: data.icon_96x96, sizes: "96x96", type: "image/png" },
              data.icon_128x128 && { src: data.icon_128x128, sizes: "128x128", type: "image/png" },
              data.icon_144x144 && { src: data.icon_144x144, sizes: "144x144", type: "image/png" },
              data.icon_152x152 && { src: data.icon_152x152, sizes: "152x152", type: "image/png" },
              data.icon_192x192 && { src: data.icon_192x192, sizes: "192x192", type: "image/png" },
              data.icon_384x384 && { src: data.icon_384x384, sizes: "384x384", type: "image/png" },
              data.icon_512x512 && { src: data.icon_512x512, sizes: "512x512", type: "image/png" },
            ].filter(Boolean),
            screenshots: [
              data.screenshot_mobile && {
                src: data.screenshot_mobile,
                sizes: "640x1136",
                type: "image/png",
                form_factor: "narrow"
              },
              data.screenshot_desktop && {
                src: data.screenshot_desktop,
                sizes: "1920x1080",
                type: "image/png",
                form_factor: "wide"
              }
            ].filter(Boolean)
          };
          setManifestData(manifestData);
        }
      } catch (err) {
        console.error("Error in fetchPWASettings:", err);
      }
    };

    fetchPWASettings();
  }, [storefrontId]);

  const { data: storefront, isLoading: isStorefrontLoading } = useStorefront(storefrontId || '');

  useEffect(() => {
    if (storefront) {
      console.log("Updating document title and favicon for storefront:", storefront.name);
      // Update favicon if provided
      if (storefront.favicon_url) {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = storefront.favicon_url;
        }
      }
    }
  }, [storefront]);

  if (isLoading || isStorefrontLoading) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <PreviewError error={error} />;
  }

  if (!storefrontId) {
    return <PreviewError error="No store selected" />;
  }

  return (
    <>
      {storefront && (
        <Helmet>
          <title>{storefront.page_title || storefront.name}</title>
          {storefront.favicon_url && (
            <link rel="icon" type="image/x-icon" href={storefront.favicon_url} />
          )}
          {manifestData && (
            <link 
              rel="manifest" 
              href={`data:application/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(manifestData)
              )}`} 
            />
          )}
        </Helmet>
      )}
      <div className="w-full h-screen overflow-hidden">
        <LivePreview storefrontId={storefrontId} />
      </div>
    </>
  );
}
