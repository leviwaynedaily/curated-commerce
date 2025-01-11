export async function extractDominantColor(imageUrl: string): Promise<string> {
  // Return a default color since we can't extract colors without the canvas package
  return '#000000';
}

export async function extractColorPalette(imageUrl: string): Promise<string[]> {
  // Return default colors since we can't extract colors without the canvas package
  return ['#000000', '#ffffff', '#cccccc'];
}