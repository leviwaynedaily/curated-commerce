import { ThemeConfig } from "@/types/theme";

interface ThemePreviewProps {
  theme: {
    layout_config: ThemeConfig;
    name: string;
  };
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const { colors } = theme.layout_config;

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <div
        className="w-full h-full p-4"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="h-8 rounded mb-2"
            style={{ backgroundColor: colors.background.secondary }}
          />

          {/* Content */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div
              className="rounded"
              style={{ backgroundColor: colors.background.secondary }}
            />
            <div
              className="rounded"
              style={{ backgroundColor: colors.background.secondary }}
            />
          </div>

          {/* Accent elements */}
          <div className="mt-2 flex gap-2">
            <div
              className="h-4 w-16 rounded"
              style={{ backgroundColor: colors.background.accent }}
            />
            <div
              className="h-4 w-16 rounded"
              style={{ backgroundColor: colors.background.accent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}