export interface ThemeConfig {
  colors: {
    background: {
      primary: string;
      secondary: string;
      accent: string;
    };
    font: {
      primary: string;
      secondary: string;
      highlight: string;
    };
  };
  layout?: {
    header?: {
      position?: string;
      background?: string;
    };
    products?: {
      display?: string;
      columns?: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      gap?: string;
    };
  };
  components?: {
    card?: {
      background?: string;
      border?: string;
      borderRadius?: string;
      shadow?: string;
    };
    badge?: {
      background?: string;
      color?: string;
      borderRadius?: string;
      fontSize?: string;
    };
    modal?: {
      background?: string;
      borderRadius?: string;
      shadow?: string;
    };
    button?: {
      background?: string;
      color?: string;
      borderRadius?: string;
      hover?: {
        transform?: string;
        shadow?: string;
      };
    };
  };
}