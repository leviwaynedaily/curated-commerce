import { useEffect, useRef } from "react";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewError } from "./preview/PreviewError";
import { PreviewLoading } from "./preview/PreviewLoading";
import { PreviewData } from "@/types/preview";
import { useStorefront } from "@/hooks/useStorefront";

interface LivePreviewProps {
  storefrontId: string;
}

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const { data, isLoading, error } = useStorefront(storefrontId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    <div className="w-full h-full bg-background">
      <div className="w-full h-full flex flex-col">
        <PreviewHeader previewData={data} />
        <div className="flex-1 overflow-y-auto">
          <PreviewContent previewData={data} />
        </div>
      </div>
    </div>
  );
}