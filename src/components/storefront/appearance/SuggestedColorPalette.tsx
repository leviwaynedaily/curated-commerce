import { Card, CardContent } from "@/components/ui/card";

interface SuggestedColorPaletteProps {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
}

export function SuggestedColorPalette({ colors }: SuggestedColorPaletteProps) {
  if (!colors.primary.length && !colors.secondary.length && !colors.accent.length) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Primary Colors</h4>
          <div className="flex gap-2">
            {colors.primary.map((color, index) => (
              <div key={index} className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-center font-mono">{color}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Secondary Colors</h4>
          <div className="flex gap-2">
            {colors.secondary.map((color, index) => (
              <div key={index} className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-center font-mono">{color}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Accent Colors</h4>
          <div className="flex gap-2">
            {colors.accent.map((color, index) => (
              <div key={index} className="space-y-1">
                <div
                  className="w-12 h-12 rounded-lg border"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-center font-mono">{color}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}