import { ThemeConfig } from "@/types/theme";
import { Search, Grid, Filter } from "lucide-react";

interface ThemePreviewProps {
  theme: {
    layout_config: ThemeConfig;
    name: string;
  };
}

const defaultTheme: ThemeConfig = {
  colors: {
    background: {
      primary: "#ffffff",
      secondary: "#f5f5f5",
      accent: "#000000",
    },
    font: {
      primary: "#000000",
      secondary: "#666666",
      highlight: "#333333",
    },
  },
};

export function ThemePreview({ theme }: ThemePreviewProps) {
  const colors = theme?.layout_config?.colors ?? defaultTheme.colors;
  const layout = theme?.layout_config?.layout ?? {};
  const components = theme?.layout_config?.components ?? {};

  console.log("Theme Preview Colors:", colors);

  return (
    <div className="aspect-video rounded-lg overflow-hidden shadow-md">
      <div
        className="w-full h-full flex flex-col"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Sticky Header */}
        <div
          className="p-3 border-b backdrop-blur-sm"
          style={{ 
            backgroundColor: `${colors.background.primary}ee`,
            borderColor: colors.background.secondary 
          }}
        >
          {/* Logo Area */}
          <div className="flex items-center justify-between mb-2">
            <div 
              className="text-lg font-bold"
              style={{ 
                background: colors.font.highlight.includes('gradient') 
                  ? colors.font.highlight 
                  : 'none',
                WebkitBackgroundClip: colors.font.highlight.includes('gradient') ? 'text' : 'none',
                WebkitTextFillColor: colors.font.highlight.includes('gradient') ? 'transparent' : colors.font.primary,
              }}
            >
              Logo
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div 
              className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Search className="w-4 h-4" style={{ color: colors.font.secondary }} />
              <span style={{ color: colors.font.secondary }}>Search...</span>
            </div>
            <div className="flex gap-1">
              <button
                className="p-1.5 rounded-full"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <Grid className="w-4 h-4" style={{ color: colors.font.secondary }} />
              </button>
              <button
                className="p-1.5 rounded-full"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <Filter className="w-4 h-4" style={{ color: colors.font.secondary }} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-3 grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-lg overflow-hidden"
              style={{ 
                backgroundColor: components?.card?.background || colors.background.secondary,
                boxShadow: components?.card?.shadow,
                border: components?.card?.border,
                borderRadius: components?.card?.borderRadius
              }}
            >
              <div 
                className="h-12 mb-2"
                style={{ backgroundColor: `${colors.background.accent}22` }}
              />
              <div className="p-2">
                <div 
                  className="w-12 h-4 rounded-full mb-1"
                  style={{ backgroundColor: colors.background.accent }}
                />
                <div 
                  className="w-20 h-3 rounded"
                  style={{ backgroundColor: colors.background.secondary }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}