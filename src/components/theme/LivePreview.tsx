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
      try {
        // Clear any previous errors
        setError(null);

        // If we have a storefrontId from URL params (preview mode), use that
        if (storefrontId) {
          console.log("Preview mode - Using storefront ID from URL:", storefrontId);
          setTargetId(storefrontId);
          return;
        }
        
        // If we have a slug (public access mode), look up the storefront
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
            setTargetId(null);
            return;
          }

          if (!data) {
            console.error("No storefront found for slug:", slug);
            setError("Store not found");
            setTargetId(null);
            return;
          }

          console.log("Found storefront ID for slug:", data.id);
          setTargetId(data.id);
        } else {
          setError("No store specified");
          setTargetId(null);
        }
      } catch (err) {
        console.error("Error in fetchStorefrontId:", err);
        setError("Failed to load store");
        setTargetId(null);
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

  if (error) {
    return <PreviewError error={error} />;
  }

  if (isLoading || !previewData) {
    return <PreviewLoading />;
  }

  return <PreviewContent previewData={previewData} />;
}