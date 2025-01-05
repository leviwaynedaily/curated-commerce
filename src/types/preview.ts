export interface PreviewData {
  id?: string;
  name?: string;
  description?: string;
  logo_url?: string;
  verification_type?: 'none' | 'age' | 'password' | 'both';
  verification_age_text?: string;
  verification_legal_text?: string;
  verification_logo_url?: string;
  verification_password?: string;
  enable_instructions?: boolean;
  instructions_text?: string;
  show_description?: boolean;
}