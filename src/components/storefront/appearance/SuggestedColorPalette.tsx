import { Card, CardContent } from "@/components/ui/card";

interface SuggestedColorPaletteProps {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  logoUrl?: string | null;
}

export function SuggestedColorPalette({ colors = { primary: [], secondary: [], accent: [] }, logoUrl }: SuggestedColorPaletteProps) {
  // If no colors and no logo, don't render anything
  if (!colors?.primary?.length && !colors?.secondary?.length && !colors?.accent?.length && !logoUrl) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-6 flex-1">
            <h3 className="text-lg font-medium">Suggested Color Palette</h3>
            
            <div className="space-y-4">
              {colors?.primary?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Primary Colors</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {colors.primary.map((color, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-[11px] text-center font-mono truncate max-w-[90%]">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {colors?.secondary?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Secondary Colors</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {colors.secondary.map((color, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-[11px] text-center font-mono truncate max-w-[90%]">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {colors?.accent?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Accent Colors</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {colors.accent.map((color, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-[11px] text-center font-mono truncate max-w-[90%]">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {logoUrl && (
            <div className="ml-8 p-4 bg-muted rounded-lg w-[120px]">
              <p className="text-sm text-muted-foreground mb-2">Current Logo:</p>
              <img
                src={logoUrl}
                alt="Current logo"
                className="w-full h-auto object-contain max-h-[100px]"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}