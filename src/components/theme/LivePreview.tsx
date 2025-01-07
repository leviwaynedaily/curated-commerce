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

  // First try to get storefront ID from URL params, then try to look it up by slug
  const targetId = storefrontId || (slug ? await getStorefrontIdBySlug(slug) : null);
  
  const { data: previewData, isLoading, error: storefrontError } = useStorefront(targetId || "");

  useEffect(() => {
    if (storefrontError) {
      console.error("Error loading storefront:", storefrontError);
      setError("Failed to load storefront data");
    }
  }, [storefrontError]);

  // Handle manifest link
  useEffect(() => {
    if (previewData?.id) {
      // Remove any existing manifest link
      const existingManifest = document.querySelector('link[rel="manifest"]');
      if (existingManifest) {
        existingManifest.remove();
      }

      // Add new manifest link if PWA is configured
      const manifestUrl = `${window.location.origin}/manifest.json?id=${previewData.id}`;
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestUrl;
      document.head.appendChild(link);
    }
  }, [previewData?.id]);

  if (error) {
    return <PreviewError message={error} />;
  }

  if (isLoading || !previewData) {
    return <PreviewLoading />;
  }

  return <PreviewContent previewData={previewData} />;
}

// Helper function to get storefront ID from slug
async function getStorefrontIdBySlug(slug: string): Promise<string | null> {
  try {
    console.log("Looking up storefront by slug:", slug);
    const { data, error } = await supabase
      .from("storefronts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error fetching storefront:", error);
      return null;
    }

    console.log("Found storefront ID for slug:", data?.id);
    return data?.id || null;
  } catch (error) {
    console.error("Failed to fetch storefront:", error);
    return null;
  }
}