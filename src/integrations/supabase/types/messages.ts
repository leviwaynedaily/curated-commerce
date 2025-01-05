import { Database } from './common';

export interface MessagesTable {
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
    }
  ]
}