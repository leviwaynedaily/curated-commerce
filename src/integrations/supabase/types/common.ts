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
      businesses: BusinessesTable
      messages: MessagesTable
      products: ProductsTable
      pwa_settings: PwaSettingsTable
      storefronts: StorefrontsTable
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