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
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Create color map to store unique colors and their frequency
    const colorMap = new Map();
    
    // Process pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Skip transparent or near-transparent pixels
      if (a < 128) continue;
      
      // Skip white and black pixels
      if ((r > 250 && g > 250 && b > 250) || (r < 5 && g < 5 && b < 5)) continue;
      
      const color = rgbToHsl(r, g, b);
      const key = `${Math.round(color.h * 360)},${Math.round(color.s * 100)},${Math.round(color.l * 100)}`;
      
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
    
    // Sort colors by frequency and convert back to hex
    const sortedColors = Array.from(colorMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => {
        const [h, s, l] = key.split(',').map(Number);
        return hslToHex(h / 360, s / 100, l / 100);
      });
    
    // Get the most prominent colors
    const primaryColors = sortedColors.slice(0, 3);
    const secondaryColors = primaryColors.map(color => adjustHue(color, 30));
    const accentColors = primaryColors.map(color => adjustHue(color, 180));
    
    const result = {
      primary: primaryColors,
      secondary: secondaryColors,
      accent: accentColors,
    };

    console.log('Extracted color palette:', result);
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

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

// Adjust hue of a color
function adjustHue(hex: string, degrees: number): string {
  // Convert hex to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  // Convert RGB to HSL
  const hsl = rgbToHsl(r, g, b);
  
  // Adjust hue
  hsl.h = ((hsl.h * 360 + degrees) % 360) / 360;
  
  // Convert back to hex
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export const extractColors = extractColorsFromLogo;