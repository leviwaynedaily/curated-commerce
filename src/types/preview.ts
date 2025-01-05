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
  verification_button_color?: string;
  verification_button_text_color?: string;
  verification_text_color?: string;
  verification_checkbox_color?: string;
  verification_input_border_color?: string;
  verification_next_text_color?: string;
}