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
  const storefrontId = searchParams.get("storefrontId");
  const [error, setError] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefrontId = async () => {
      if (storefrontId) {
        setTargetId(storefrontId);
        return;
      }
      
      if (slug) {
        try {
          console.log("Looking up storefront by slug:", slug);
          const { data, error } = await supabase
            .from("storefronts")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

          if (error) {
            console.error("Error fetching storefront:", error);
            setError("Failed to load storefront");
            return;
          }

          console.log("Found storefront ID for slug:", data?.id);
          setTargetId(data?.id || null);
        } catch (error) {
          console.error("Failed to fetch storefront:", error);
          setError("Failed to load storefront");
        }
      }
    };

    fetchStorefrontId();
  }, [slug, storefrontId]);
  
  const { data: previewData, isLoading, error: storefrontError } = useStorefront(targetId || "");

  useEffect(() => {
    if (storefrontError) {
      console.error("Error loading storefront:", storefrontError);
      setError("Failed to load storefront data");
    }
  }, [storefrontError]);

  // Remove manifest link handling from here since it's now handled by the PWA settings

  if (error) {
    return <PreviewError error={error} />;
  }

  if (isLoading || !previewData) {
    return <PreviewLoading />;
  }

  return <PreviewContent previewData={previewData} />;
}