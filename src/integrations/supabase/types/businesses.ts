import { Database } from './common';

export interface BusinessesTable {
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