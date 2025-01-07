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

  const { data: storefront, isLoading: isStorefrontLoading } = useStorefront(storefrontId || '');

  // Generate manifest content based on storefront data
  const manifestContent = storefront ? {
    name: storefront.name || '',
    short_name: storefront.name || '',
    description: storefront.description || "Welcome to our store",
    start_url: `/${storefront.slug || ''}`,
    display: "standalone",
    background_color: storefront.storefront_background_color || "#ffffff",
    theme_color: storefront.main_color || "#000000",
    icons: [
      {
        src: storefront.favicon_url || "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: storefront.favicon_url || "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  } : null;

  useEffect(() => {
    if (storefront) {
      console.log("Updating document title and favicon for storefront:", storefront.name);
      document.title = storefront.page_title || storefront.name || '';
      
      // Update favicon if provided
      if (storefront.favicon_url) {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = storefront.favicon_url;
        } else {
          const newFavicon = document.createElement('link');
          newFavicon.rel = 'icon';
          newFavicon.href = storefront.favicon_url;
          document.head.appendChild(newFavicon);
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
      {storefront && manifestContent && (
        <Helmet>
          <title>{storefront.page_title || storefront.name}</title>
          {storefront.favicon_url && (
            <link rel="icon" type="image/x-icon" href={storefront.favicon_url} />
          )}
          <link 
            rel="manifest" 
            href={`data:application/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(manifestContent)
            )}`}
          />
          <meta name="theme-color" content={storefront.main_color || "#000000"} />
          <meta name="background-color" content={storefront.storefront_background_color || "#ffffff"} />
          <meta name="description" content={storefront.description || "Welcome to our store"} />
        </Helmet>
      )}
      <LivePreview />
    </>
  );
}