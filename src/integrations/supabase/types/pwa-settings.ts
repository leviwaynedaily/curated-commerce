import { Database } from './common';

export interface PwaSettingsTable {
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
    }
  ]
}