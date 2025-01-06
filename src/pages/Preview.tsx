import { useSearchParams, useParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
    <div className="w-full h-screen overflow-hidden">
      <LivePreview storefrontId={storefrontId} />
    </div>
  );
}
