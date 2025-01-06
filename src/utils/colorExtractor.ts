import { ThemeConfig } from "@/types/theme";

export async function extractColors(imageUrl: string): Promise<ThemeConfig["colors"]> {
  // Return default colors since we can't extract them without the canvas package
  return {
    background: {
      primary: "#FFFFFF",
      secondary: "#F5F5F5",
      accent: "#E5E7EB",
    },
    font: {
      primary: "#1A1F2C",
      secondary: "#4B5563",
      highlight: "#D946EF",
    },
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}