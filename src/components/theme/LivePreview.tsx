import { useEffect, useRef } from "react";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewError } from "./preview/PreviewError";
import { PreviewLoading } from "./preview/PreviewLoading";
import { PreviewData } from "@/types/preview";

interface LivePreviewProps {
  data: PreviewData | null;
  isLoading: boolean;
  error: Error | null;
}

export function LivePreview({ data, isLoading, error }: LivePreviewProps) {
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
    let faviconLink = iframeDoc.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = iframeDoc.createElement('link');
      faviconLink.rel = 'icon';
      iframeDoc.head.appendChild(faviconLink);
    }
    faviconLink.href = data.favicon_url || '/favicon.ico';

    // Update manifest
    let manifestLink = iframeDoc.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = iframeDoc.createElement('link');
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

  if (error) return <PreviewError error={error} />;
  if (isLoading) return <PreviewLoading />;
  if (!data) return null;

  return (
    <div className="w-full h-full bg-background">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        title="Store Preview"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Store Preview</title>
              <link rel="icon" href="/favicon.ico" />
              <link rel="manifest" href="/manifest.json" />
              ${document.head.innerHTML}
            </head>
            <body>
              <div id="root">
                <div style="display: flex; flex-direction: column; min-height: 100vh;">
                  ${PreviewHeader({ data })}
                  ${PreviewContent({ data })}
                </div>
              </div>
            </body>
          </html>
        `}
      />
    </div>
  );
}