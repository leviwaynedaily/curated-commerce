import { Database } from './common';

export interface StorefrontsTable {
  Row: {
    id: string
    created_at: string | null
    updated_at: string | null
    business_id: string | null
    name: string
    slug: string
    description: string | null
    logo_url: string | null
    favicon_url: string | null
    verification_type: Database["public"]["Enums"]["verification_type"] | null
    verification_password: string | null
    verification_age: number | null
    is_published: boolean | null
    custom_domain: string | null
    page_title: string | null
    show_description: boolean | null
    verification_age_text: string | null
    verification_legal_text: string | null
    verification_logo_url: string | null
    enable_instructions: boolean | null
    instructions_text: string | null
    verification_button_color: string | null
    verification_button_text_color: string | null
    verification_text_color: string | null
    verification_checkbox_color: string | null
    verification_input_border_color: string | null
    main_color: string | null
    secondary_color: string | null
    font_color: string | null
  }
  Insert: {
    id?: string
    created_at?: string | null
    updated_at?: string | null
    business_id?: string | null
    name: string
    slug: string
    description?: string | null
    logo_url?: string | null
    favicon_url?: string | null
    verification_type?: Database["public"]["Enums"]["verification_type"] | null
    verification_password?: string | null
    verification_age?: number | null
    is_published?: boolean | null
    custom_domain?: string | null
    page_title?: string | null
    show_description?: boolean | null
    verification_age_text?: string | null
    verification_legal_text?: string | null
    verification_logo_url?: string | null
    enable_instructions?: boolean | null
    instructions_text?: string | null
    verification_button_color?: string | null
    verification_button_text_color?: string | null
    verification_text_color?: string | null
    verification_checkbox_color?: string | null
    verification_input_border_color?: string | null
    main_color?: string | null
    secondary_color?: string | null
    font_color?: string | null
  }
  Update: {
    id?: string
    created_at?: string | null
    updated_at?: string | null
    business_id?: string | null
    name?: string
    slug?: string
    description?: string | null
    logo_url?: string | null
    favicon_url?: string | null
    verification_type?: Database["public"]["Enums"]["verification_type"] | null
    verification_password?: string | null
    verification_age?: number | null
    is_published?: boolean | null
    custom_domain?: string | null
    page_title?: string | null
    show_description?: boolean | null
    verification_age_text?: string | null
    verification_legal_text?: string | null
    verification_logo_url?: string | null
    enable_instructions?: boolean | null
    instructions_text?: string | null
    verification_button_color?: string | null
    verification_button_text_color?: string | null
    verification_text_color?: string | null
    verification_checkbox_color?: string | null
    verification_input_border_color?: string | null
    main_color?: string | null
    secondary_color?: string | null
    font_color?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "storefronts_business_id_fkey"
      columns: ["business_id"]
      isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
  ]
}