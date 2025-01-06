import { useSearchParams, useParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useStorefront } from "@/hooks/useStorefront";

export default function Preview() {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const [storefrontId, setStorefrontId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStorefrontId = async () => {
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
          .single();

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
    };

    getStorefrontId();
  }, [searchParams, slug]);

  const { data: storefront } = useStorefront(storefrontId || '');

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4 text-muted-foreground">
        {error}
      </div>
    );
  }

  if (!storefrontId) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
      <div className="w-full h-screen overflow-hidden">
        <LivePreview storefrontId={storefrontId} />
      </div>
    </>
  );
}