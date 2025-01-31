export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_users: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["business_user_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["business_user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["business_user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: []
      }
      manifests: {
        Row: {
          created_at: string | null
          id: string
          manifest_json: Json
          storefront_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          manifest_json: Json
          storefront_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          manifest_json?: Json
          storefront_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manifests_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: true
            referencedRelation: "storefronts"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "messages_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string[] | null
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          in_town_price: number | null
          name: string
          shipping_price: number | null
          sort_order: number | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_number: string | null
          storefront_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          in_town_price?: number | null
          name: string
          shipping_price?: number | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_number?: string | null
          storefront_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          in_town_price?: number | null
          name?: string
          shipping_price?: number | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_number?: string | null
          storefront_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pwa_settings: {
        Row: {
          background_color: string | null
          created_at: string | null
          description: string | null
          display: Database["public"]["Enums"]["pwa_display_mode"] | null
          icon_128x128: string | null
          icon_144x144: string | null
          icon_152x152: string | null
          icon_192x192: string | null
          icon_384x384: string | null
          icon_512x512: string | null
          icon_72x72: string | null
          icon_96x96: string | null
          id: string
          manifest_url: string | null
          name: string
          orientation: Database["public"]["Enums"]["pwa_orientation"] | null
          screenshot_desktop: string | null
          screenshot_mobile: string | null
          short_name: string
          start_url: string | null
          storefront_id: string | null
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: Database["public"]["Enums"]["pwa_display_mode"] | null
          icon_128x128?: string | null
          icon_144x144?: string | null
          icon_152x152?: string | null
          icon_192x192?: string | null
          icon_384x384?: string | null
          icon_512x512?: string | null
          icon_72x72?: string | null
          icon_96x96?: string | null
          id?: string
          manifest_url?: string | null
          name: string
          orientation?: Database["public"]["Enums"]["pwa_orientation"] | null
          screenshot_desktop?: string | null
          screenshot_mobile?: string | null
          short_name: string
          start_url?: string | null
          storefront_id?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          created_at?: string | null
          description?: string | null
          display?: Database["public"]["Enums"]["pwa_display_mode"] | null
          icon_128x128?: string | null
          icon_144x144?: string | null
          icon_152x152?: string | null
          icon_192x192?: string | null
          icon_384x384?: string | null
          icon_512x512?: string | null
          icon_72x72?: string | null
          icon_96x96?: string | null
          id?: string
          manifest_url?: string | null
          name?: string
          orientation?: Database["public"]["Enums"]["pwa_orientation"] | null
          screenshot_desktop?: string | null
          screenshot_mobile?: string | null
          short_name?: string
          start_url?: string | null
          storefront_id?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pwa_settings_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: true
            referencedRelation: "storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_users: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["storefront_user_role"]
          storefront_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["storefront_user_role"]
          storefront_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["storefront_user_role"]
          storefront_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storefront_users_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefronts: {
        Row: {
          business_id: string | null
          created_at: string | null
          custom_domain: string | null
          description: string | null
          enable_instructions: boolean | null
          favicon_url: string | null
          font_color: string | null
          has_pwa: boolean | null
          header_color: string | null
          header_opacity: number | null
          id: string
          instructions_text: string | null
          is_published: boolean | null
          logo_url: string | null
          main_color: string | null
          name: string
          page_title: string | null
          product_card_background_color: string | null
          product_category_background_color: string | null
          product_category_text_color: string | null
          product_description_text_color: string | null
          product_price_button_color: string | null
          product_price_color: string | null
          product_title_text_color: string | null
          pwa_manifest_url: string | null
          secondary_color: string | null
          show_description: boolean | null
          slug: string
          storefront_background_color: string | null
          updated_at: string | null
          verification_age: number | null
          verification_age_text: string | null
          verification_button_color: string | null
          verification_button_text_color: string | null
          verification_checkbox_color: string | null
          verification_input_border_color: string | null
          verification_legal_text: string | null
          verification_logo_url: string | null
          verification_modal_background_color: string | null
          verification_next_text_color: string | null
          verification_password: string | null
          verification_text_color: string | null
          verification_type:
            | Database["public"]["Enums"]["verification_type"]
            | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          description?: string | null
          enable_instructions?: boolean | null
          favicon_url?: string | null
          font_color?: string | null
          has_pwa?: boolean | null
          header_color?: string | null
          header_opacity?: number | null
          id?: string
          instructions_text?: string | null
          is_published?: boolean | null
          logo_url?: string | null
          main_color?: string | null
          name: string
          page_title?: string | null
          product_card_background_color?: string | null
          product_category_background_color?: string | null
          product_category_text_color?: string | null
          product_description_text_color?: string | null
          product_price_button_color?: string | null
          product_price_color?: string | null
          product_title_text_color?: string | null
          pwa_manifest_url?: string | null
          secondary_color?: string | null
          show_description?: boolean | null
          slug: string
          storefront_background_color?: string | null
          updated_at?: string | null
          verification_age?: number | null
          verification_age_text?: string | null
          verification_button_color?: string | null
          verification_button_text_color?: string | null
          verification_checkbox_color?: string | null
          verification_input_border_color?: string | null
          verification_legal_text?: string | null
          verification_logo_url?: string | null
          verification_modal_background_color?: string | null
          verification_next_text_color?: string | null
          verification_password?: string | null
          verification_text_color?: string | null
          verification_type?:
            | Database["public"]["Enums"]["verification_type"]
            | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          description?: string | null
          enable_instructions?: boolean | null
          favicon_url?: string | null
          font_color?: string | null
          has_pwa?: boolean | null
          header_color?: string | null
          header_opacity?: number | null
          id?: string
          instructions_text?: string | null
          is_published?: boolean | null
          logo_url?: string | null
          main_color?: string | null
          name?: string
          page_title?: string | null
          product_card_background_color?: string | null
          product_category_background_color?: string | null
          product_category_text_color?: string | null
          product_description_text_color?: string | null
          product_price_button_color?: string | null
          product_price_color?: string | null
          product_title_text_color?: string | null
          pwa_manifest_url?: string | null
          secondary_color?: string | null
          show_description?: boolean | null
          slug?: string
          storefront_background_color?: string | null
          updated_at?: string | null
          verification_age?: number | null
          verification_age_text?: string | null
          verification_button_color?: string | null
          verification_button_text_color?: string | null
          verification_checkbox_color?: string | null
          verification_input_border_color?: string | null
          verification_legal_text?: string | null
          verification_logo_url?: string | null
          verification_modal_background_color?: string | null
          verification_next_text_color?: string | null
          verification_password?: string | null
          verification_text_color?: string | null
          verification_type?:
            | Database["public"]["Enums"]["verification_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "storefronts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_user_role: "owner" | "member"
      product_status: "active" | "inactive"
      pwa_display_mode: "standalone" | "fullscreen" | "minimal-ui" | "browser"
      pwa_orientation: "portrait" | "landscape" | "any"
      storefront_user_role: "owner" | "member" | "editor"
      theme_category: "grid" | "list" | "masonry" | "carousel"
      verification_type: "none" | "age" | "password" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
