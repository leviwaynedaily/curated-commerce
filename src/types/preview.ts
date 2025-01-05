export interface PreviewData {
  id?: string;
  name?: string;
  description?: string;
  logo_url?: string;
  theme_config?: ThemeConfig;
  verification_type?: string;
  verification_age_text?: string;
  verification_legal_text?: string;
  verification_logo_url?: string;
  verification_password?: string;
  enable_instructions?: boolean;
  instructions_text?: string;
  show_description?: boolean;
}

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
}