import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bplsogdsyabqfftwclka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbHNvZ2RzeWFicWZmdHdjbGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0ODI0ODEsImV4cCI6MjAyMDA1ODQ4MX0.SuYKxrW1g0qMhqSSn3ePSpqZYpyxGPVGHrqTS9AZG94";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  }
);