// Simple color extractor that returns default colors
// This version doesn't depend on canvas or other external packages

export const extractColors = async (imageUrl: string): Promise<string[]> => {
  console.log('Extracting colors from:', imageUrl);
  
  // Return default color palette that matches the app's design
  return [
    '#1A1F2C', // Dark blue/gray
    '#D946EF', // Pink
    '#4CAF50', // Green
    '#F1F0FB', // Light gray
    '#FFFFFF', // White
  ];
};

export const getMainColors = async (imageUrl: string) => {
  console.log('Getting main colors from:', imageUrl);
  const colors = await extractColors(imageUrl);
  
  return {
    primary: colors[0] || '#1A1F2C',
    secondary: colors[1] || '#D946EF',
    accent: colors[2] || '#4CAF50',
    background: colors[3] || '#F1F0FB',
    text: colors[4] || '#FFFFFF',
  };
};