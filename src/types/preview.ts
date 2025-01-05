import { ThemeConfig } from "./theme";
import { Database } from "@/integrations/supabase/types";

type VerificationType = Database['public']['Enums']['verification_type'];

export interface PreviewData {
  id?: string;
  name?: string;
  description?: string;
  logo_url?: string;
  theme_config?: ThemeConfig;
  verification_type?: VerificationType;
  verification_age_text?: string;
  verification_legal_text?: string;
  verification_logo_url?: string;
  verification_password?: string;
  enable_instructions?: boolean;
  instructions_text?: string;
  show_description?: boolean;
}