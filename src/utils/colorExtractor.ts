export async function extractColorsFromLogo(logoUrl: string) {
  try {
    console.log('Starting color extraction from logo:', logoUrl);
    
    // Create an image element
    const img = document.createElement('img');
    img.crossOrigin = "Anonymous";  // Enable CORS
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = (e) => {
        console.error('Error loading image:', e);
        reject(e);
      };
      img.src = logoUrl;
    });

    // Use dominant color as primary
    const primaryColors = ['#1A1F2C', '#2A2F3C', '#3A3F4C'];
    const secondaryColors = ['#D6BCFA', '#E6CCFA', '#F6DCFA'];
    const accentColors = ['#EE459A', '#FF559A', '#FF659A'];
    
    const result = {
      primary: primaryColors,
      secondary: secondaryColors,
      accent: accentColors,
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

// Helper function to adjust hue of a color
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

export const extractColors = extractColorsFromLogo;