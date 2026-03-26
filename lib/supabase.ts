import { createClient } from '@supabase/supabase-js';

// Supabase credentials from .env.local
const SUPABASE_URL = 'https://vdkeltyfiyarywxbpjwg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2VsdHlmaXlhcnl3eGJwandnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTUwNTcsImV4cCI6MjA4OTQ3MTA1N30.jIN7oCkXqw_OPkvnRBTjwTS3Enw7Nejn718h2kyh4cA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Student type definition
export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  age: number | null;
  department: string;
  email: string | null;
  district: string | null;
  pincode: string | null;
  address: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

// Department options
export const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'IT', 'Others'];
