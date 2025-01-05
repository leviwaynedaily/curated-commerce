import { Database } from './common';

export interface MessagesTable {
  Row: Database['public']['Tables']['messages']['Row']
  Insert: Database['public']['Tables']['messages']['Insert']
  Update: Database['public']['Tables']['messages']['Update']
  Relationships: [
    {
      foreignKeyName: "messages_storefront_id_fkey"
      columns: ["storefront_id"]
      isOneToOne: false
      referencedRelation: "storefronts"
      referencedColumns: ["id"]
    }
  ]
}