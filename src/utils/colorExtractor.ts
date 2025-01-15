import { ColorThief } from 'color-thief-ts';

export async function extractDominantColor(imageUrl: string): Promise<string> {
  try {
    const colorThief = new ColorThief();
    
    // Create a new image element
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Get the dominant color
    const color = await colorThief.getColor(img);
    
    // Convert RGB to hex
    return `#${color.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  } catch (error) {
    console.error('Error extracting color:', error);
    return '#000000'; // Default fallback color
  }
}