import { Database } from './common';

export interface ProductsTable {
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
    status: Database["public"]["Enums"]["product_status"] | null
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
    status?: Database["public"]["Enums"]["product_status"] | null
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
    status?: Database["public"]["Enums"]["product_status"] | null
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
    }
  ]
}