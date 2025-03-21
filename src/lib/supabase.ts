
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { toast } from '@/hooks/use-toast';

// These environment variables will be provided by the Supabase integration
// Check if we have actual values or just placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholderConfig = 
  !supabaseUrl || 
  supabaseUrl === 'https://your-project-url.supabase.co' || 
  !supabaseAnonKey || 
  supabaseAnonKey === 'your-anon-key';

// Show a warning in the console if using placeholder values
if (isPlaceholderConfig) {
  console.warn(
    'Supabase is configured with placeholder values. Authentication and database operations will not work.\n' +
    'Please connect to Supabase to get actual credentials.'
  );
}

// Create a single supabase client for the entire app with type safety
export const supabase = createClient<Database>(
  supabaseUrl || 'https://your-project-url.supabase.co', 
  supabaseAnonKey || 'your-anon-key'
);

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  if (isPlaceholderConfig) {
    return {
      connected: false,
      message: "Supabase is not configured. Please set up your Supabase credentials.",
      error: new Error("Missing or invalid Supabase credentials.")
    };
  }

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

// Function that can be called to check if Supabase auth can be used
export const isSupabaseAuthConfigured = () => {
  return !isPlaceholderConfig;
};
