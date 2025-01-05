import { Database } from './common';

export interface StorefrontsTable {
  Row: Database['public']['Tables']['storefronts']['Row']
  Insert: Database['public']['Tables']['storefronts']['Insert']
  Update: Database['public']['Tables']['storefronts']['Update']
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