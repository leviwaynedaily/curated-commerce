import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PWAManifestPreviewProps {
  manifestJson: string | null;
}

export function PWAManifestPreview({ manifestJson }: PWAManifestPreviewProps) {
  if (!manifestJson) return null;

  return (
    <Card>
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">Generated Manifest</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-secondary/5 p-2 rounded-lg overflow-x-auto">
          <code className="text-[10px] font-mono whitespace-pre-wrap break-all leading-tight">
            {manifestJson}
          </code>
        </pre>
      </CardContent>
    </Card>
  );
}