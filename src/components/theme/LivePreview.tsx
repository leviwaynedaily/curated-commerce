import { useEffect, useRef, useState } from "react";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewError } from "./preview/PreviewError";
import { PreviewLoading } from "./preview/PreviewLoading";
import { PreviewData } from "@/types/preview";
import { useStorefront } from "@/hooks/useStorefront";
import { supabase } from "@/integrations/supabase/client";

interface LivePreviewProps {
  storefrontId: string;
}

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const { data, isLoading, error, refetch } = useStorefront(storefrontId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Subscribe to realtime updates for the storefront
  useEffect(() => {
    if (!storefrontId) return;

    console.log("Setting up realtime subscription for storefront:", storefrontId);
    
    const channel = supabase
      .channel('storefront-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'storefronts',
          filter: `id=eq.${storefrontId}`
        },
        async (payload) => {
          console.log("Received storefront update:", payload);
          // Refetch the storefront data to update the preview
          await refetch();
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [storefrontId, refetch]);

  useEffect(() => {
    if (!data) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;

    // Update title
    const title = data.page_title || data.name || "Store Preview";
    iframeDoc.title = title;

    // Update favicon
    let faviconLink = iframeDoc.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = iframeDoc.createElement('link') as HTMLLinkElement;
      faviconLink.rel = 'icon';
      iframeDoc.head.appendChild(faviconLink);
    }
    faviconLink.href = data.favicon_url || '/favicon.ico';

    // Update manifest
    let manifestLink = iframeDoc.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = iframeDoc.createElement('link') as HTMLLinkElement;
      manifestLink.rel = 'manifest';
      iframeDoc.head.appendChild(manifestLink);
    }
    manifestLink.href = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/serve-manifest?slug=${data.slug}`;

    return () => {
      if (iframeDoc) {
        iframeDoc.title = "Store Preview";
        if (faviconLink) faviconLink.href = '/favicon.ico';
        if (manifestLink) manifestLink.href = '/manifest.json';
      }
    };
  }, [data]);

  if (error) return <PreviewError error={error.message} />;
  if (isLoading) return <PreviewLoading />;
  if (!data) return null;

  return (
    <div className="w-full h-full bg-background overflow-auto">
      <div className="w-full min-h-full flex flex-col">
        <PreviewContent 
          previewData={data}
          showInstructions={showInstructions}
          onCloseInstructions={() => setShowInstructions(false)}
          onShowInstructions={() => setShowInstructions(true)}
        />
      </div>
    </div>
  );
}