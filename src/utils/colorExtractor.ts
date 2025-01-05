export async function extractColorsFromLogo(logoUrl: string) {
  try {
    console.log('Extracting colors from logo:', logoUrl);
    
    // Create an image element
    const img = new Image();
    img.crossOrigin = "Anonymous";  // Enable CORS
    
    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = logoUrl;
    });

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data from center of image
    const imageData = ctx.getImageData(
      Math.floor(canvas.width / 4),
      Math.floor(canvas.height / 4),
      Math.floor(canvas.width / 2),
      Math.floor(canvas.height / 2)
    );
    
    // Calculate average color
    let r = 0, g = 0, b = 0;
    const data = imageData.data;
    const pixelCount = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);
    
    // Convert RGB to hex
    const primaryBackground = rgbToHex(r, g, b);
    const secondaryBackground = adjustBrightness(primaryBackground, 40);
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
        highlight: '#ee459a',
      },
    });

    return {
      primary: [primaryBackground, adjustBrightness(primaryBackground, 20), adjustBrightness(primaryBackground, -20)],
      secondary: [secondaryBackground, adjustBrightness(secondaryBackground, 20), adjustBrightness(secondaryBackground, -20)],
      accent: [accentColor, adjustBrightness(accentColor, 20), adjustBrightness(accentColor, -20)],
    };
  } catch (error) {
    console.error('Error extracting colors:', error);
    return {
      primary: ['#1A1F2C', '#2A2F3C', '#3A3F4C'],
      secondary: ['#D6BCFA', '#E6CCFA', '#F6DCFA'],
      accent: ['#EE459A', '#FF559A', '#FF659A'],
    };
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

export const extractColors = extractColorsFromLogo;