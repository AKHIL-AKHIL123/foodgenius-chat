
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These environment variables will be provided by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for the entire app with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    // Try to fetch a record from a public table
    const { data, error } = await supabase
      .from('nutrition_data')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    
    return {
      connected: true,
      message: "Successfully connected to Supabase"
    };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return {
      connected: false,
      message: "Failed to connect to Supabase. Make sure your environment variables are set correctly.",
      error
    };
  }
};
