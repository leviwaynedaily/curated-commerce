import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Download } from "lucide-react";

interface PWAManifestUrlProps {
  manifestUrl: string | null;
}

export function PWAManifestUrl({ manifestUrl }: PWAManifestUrlProps) {
  if (!manifestUrl) return null;

  return (
    <Card>
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">Manifest URL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm break-all">
          <span className="text-muted-foreground">{manifestUrl}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.open(manifestUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              fetch(manifestUrl)
                .then(response => response.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'manifest.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                });
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}