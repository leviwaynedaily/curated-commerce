export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
      }
      messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          storefront_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          storefront_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          storefront_id?: string | null
        }
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          in_town_price: number | null
          name: string
          shipping_price: number | null
          sort_order: number | null
          status: DatabaseEnums["product_status"] | null
          storefront_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          in_town_price?: number | null
          name: string
          shipping_price?: number | null
          sort_order?: number | null
          status?: DatabaseEnums["product_status"] | null
          storefront_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          in_town_price?: number | null
          name?: string
          shipping_price?: number | null
          sort_order?: number | null
          status?: DatabaseEnums["product_status"] | null
          storefront_id?: string | null
          updated_at?: string | null
        }
      }
      pwa_settings: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          storefront_id: string | null
          name: string
          short_name: string
          description: string | null
          start_url: string | null
          display: DatabaseEnums["pwa_display_mode"] | null
          orientation: DatabaseEnums["pwa_orientation"] | null
          theme_color: string | null
          background_color: string | null
          icon_72x72: string | null
          icon_96x96: string | null
          icon_128x128: string | null
          icon_144x144: string | null
          icon_152x152: string | null
          icon_192x192: string | null
          icon_384x384: string | null
          icon_512x512: string | null
          screenshot_mobile: string | null
          screenshot_desktop: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          storefront_id?: string | null
          name: string
          short_name: string
          description?: string | null
          start_url?: string | null
          display?: DatabaseEnums["pwa_display_mode"] | null
          orientation?: DatabaseEnums["pwa_orientation"] | null
          theme_color?: string | null
          background_color?: string | null
          icon_72x72?: string | null
          icon_96x96?: string | null
          icon_128x128?: string | null
          icon_144x144?: string | null
          icon_152x152?: string | null
          icon_192x192?: string | null
          icon_384x384?: string | null
          icon_512x512?: string | null
          screenshot_mobile?: string | null
          screenshot_desktop?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          storefront_id?: string | null
          name?: string
          short_name?: string
          description?: string | null
          start_url?: string | null
          display?: DatabaseEnums["pwa_display_mode"] | null
          orientation?: DatabaseEnums["pwa_orientation"] | null
          theme_color?: string | null
          background_color?: string | null
          icon_72x72?: string | null
          icon_96x96?: string | null
          icon_128x128?: string | null
          icon_144x144?: string | null
          icon_152x152?: string | null
          icon_192x192?: string | null
          icon_384x384?: string | null
          icon_512x512?: string | null
          screenshot_mobile?: string | null
          screenshot_desktop?: string | null
        }
      }
      storefronts: {
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
          verification_type: DatabaseEnums["verification_type"] | null
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
          verification_type?: DatabaseEnums["verification_type"] | null
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
          verification_type?: DatabaseEnums["verification_type"] | null
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
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type DatabaseEnums = {
  product_status: "active" | "inactive"
  pwa_display_mode: "standalone" | "fullscreen" | "minimal-ui" | "browser"
  pwa_orientation: "portrait" | "landscape" | "any"
  theme_category: "grid" | "list" | "masonry" | "carousel"
  verification_type: "none" | "age" | "password" | "both"
}