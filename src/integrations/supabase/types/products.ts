import { Database } from './common';

export interface ProductsTable {
  Row: Database['public']['Tables']['products']['Row']
  Insert: Database['public']['Tables']['products']['Insert']
  Update: Database['public']['Tables']['products']['Update']
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