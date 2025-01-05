export async function extractColorsFromLogo(logoUrl: string) {
  try {
    console.log('Starting color extraction from logo:', logoUrl);
    
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
      img.onerror = (e) => {
        console.error('Error loading image:', e);
        reject(e);
      };
      img.src = logoUrl;
    });

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data from the entire image for better color sampling
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Create color buckets to find dominant colors
    const colorBuckets: { [key: string]: number } = {};
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Skip transparent pixels
      if (a < 127) continue;
      
      // Convert to hex and count occurrences
      const hex = rgbToHex(r, g, b);
      colorBuckets[hex] = (colorBuckets[hex] || 0) + 1;
    }
    
    // Sort colors by frequency
    const sortedColors = Object.entries(colorBuckets)
      .sort(([, a], [, b]) => b - a)
      .map(([color]) => color);
    
    // Get the most frequent colors
    const primaryColor = sortedColors[0] || '#1A1F2C';
    const secondaryColor = sortedColors[1] || adjustBrightness(primaryColor, 20);
    const accentColor = sortedColors[2] || createComplementaryColor(primaryColor);
    
    console.log('Extracted dominant colors:', {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor
    });

    // Generate variations for each color
    const result = {
      primary: [
        primaryColor,
        adjustBrightness(primaryColor, 20),
        adjustBrightness(primaryColor, -20)
      ],
      secondary: [
        secondaryColor,
        adjustBrightness(secondaryColor, 20),
        adjustBrightness(secondaryColor, -20)
      ],
      accent: [
        accentColor,
        adjustBrightness(accentColor, 20),
        adjustBrightness(accentColor, -20)
      ],
    };

    console.log('Generated color palette:', result);
    return result;

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

export const extractColors = extractColorsFromLogo;