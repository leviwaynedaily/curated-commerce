import { Database } from './common';

export interface BusinessesTable {
  Row: Database['public']['Tables']['businesses']['Row']
  Insert: Database['public']['Tables']['businesses']['Insert']
  Update: Database['public']['Tables']['businesses']['Update']
  Relationships: []
}