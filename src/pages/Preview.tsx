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
        </Helmet>
      )}
      <LivePreview />
    </>
  );
}
