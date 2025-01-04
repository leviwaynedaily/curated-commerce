import { Card } from "@/components/ui/card";

interface ColorPreviewProps {
  colors: any;
}

export function ColorPreview({ colors }: ColorPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <div
        style={{ backgroundColor: colors?.background?.primary }}
        className="p-6"
      >
        <div
          style={{ backgroundColor: colors?.background?.secondary }}
          className="rounded-lg p-4"
        >
          <h4
            style={{ color: colors?.font?.primary }}
            className="mb-2 text-lg font-semibold"
          >
            Preview Heading
          </h4>
          <p
            style={{ color: colors?.font?.secondary }}
            className="mb-4 text-sm"
          >
            This is how your content will look with the selected colors.
          </p>
          <button
            style={{
              backgroundColor: colors?.background?.accent,
              color: colors?.font?.primary,
            }}
            className="rounded px-4 py-2 text-sm font-medium"
          >
            Sample Button
          </button>
          <p
            style={{ color: colors?.font?.highlight }}
            className="mt-4 text-sm font-medium"
          >
            Highlighted text example
          </p>
        </div>
      </div>
    </Card>
  );
}