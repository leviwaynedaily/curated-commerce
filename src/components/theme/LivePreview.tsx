import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewError } from "./preview/PreviewError";
import { PreviewLoading } from "./preview/PreviewLoading";
import { useStorefront } from "@/hooks/useStorefront";
import { supabase } from "@/integrations/supabase/client";

export function LivePreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const storefrontId = searchParams.get('storefrontId');
  const [error, setError] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefrontId = async () => {
      try {
        // Preview mode
        if (storefrontId) {
          console.log("Preview mode - Using storefront ID:", storefrontId);
          setTargetId(storefrontId);
          return;
        }
        
        // Public access mode
        if (slug) {
          console.log("Public access mode - Looking up storefront by slug:", slug);
          const { data, error } = await supabase
            .from("storefronts")
            .select("id")
            .eq("slug", slug)
            .eq("is_published", true)
            .maybeSingle();

          if (error || !data) {
            console.error("Store not found for slug:", slug);
            setError("Store not found");
            return;
          }

          console.log("Found storefront ID for slug:", data.id);
          setTargetId(data.id);
          return;
        }

        // This should never happen due to routing
        console.error("No storefront identifier provided");
        setError("Store not found");
      } catch (err) {
        console.error("Error loading store:", err);
        setError("Store not found");
      }
    };

    fetchStorefrontId();
  }, [slug, storefrontId]);
  
  const { data: previewData, isLoading, error: storefrontError } = useStorefront(targetId || "");

  useEffect(() => {
    if (storefrontError) {
      console.error("Error loading storefront:", storefrontError);
      setError("Store not found");
    }
  }, [storefrontError]);

  if (error) {
    return <PreviewError error={error} />;
  }

  if (isLoading || !previewData) {
    return <PreviewLoading />;
  }

  return <PreviewContent previewData={previewData} />;
}