import { getColorFromURL } from 'color-thief-node';

export async function extractColorsFromLogo(logoUrl: string) {
  try {
    console.log('Extracting colors from logo:', logoUrl);
    
    // Get the dominant color and palette
    const dominantColor = await getColorFromURL(logoUrl);
    console.log('Extracted dominant color:', dominantColor);

    // Convert RGB to hex
    const primaryBackground = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
    
    // Create a complementary color for secondary background
    const secondaryBackground = adjustBrightness(primaryBackground, 40);
    
    // Create an accent color
    const accentColor = createComplementaryColor(primaryBackground);
    
    // Determine font colors based on background brightness
    const primaryFont = isLightColor(primaryBackground) ? '#232323' : '#ffffff';
    const secondaryFont = isLightColor(secondaryBackground) ? '#333333' : '#cccccc';
    
    console.log('Generated color palette:', {
      background: {
        primary: primaryBackground,
        secondary: secondaryBackground,
        accent: accentColor,
      },
      font: {
        primary: primaryFont,
        secondary: secondaryFont,
        highlight: '#ee459a', // Keep the original highlight color
      },
    });

    return {
      background: {
        primary: primaryBackground,
        secondary: secondaryBackground,
        accent: accentColor,
      },
      font: {
        primary: primaryFont,
        secondary: secondaryFont,
        highlight: '#ee459a', // Keep the original highlight color
      },
    };
  } catch (error) {
    console.error('Error extracting colors:', error);
    throw new Error('Failed to extract colors from logo');
  }
}

// Helper functions
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const adjustColor = (color: number) => {
    return Math.min(255, Math.max(0, Math.round(color * (1 + percent / 100))));
  };
  
  return rgbToHex(
    adjustColor(rgb.r),
    adjustColor(rgb.g),
    adjustColor(rgb.b)
  );
}

function createComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return rgbToHex(
    255 - rgb.r,
    255 - rgb.g,
    255 - rgb.b
  );
}

function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}