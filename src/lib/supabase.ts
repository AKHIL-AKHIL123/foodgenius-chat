
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These environment variables will be provided by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for the entire app with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
