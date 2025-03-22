
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { toast } from '@/hooks/use-toast';

// Use the Supabase client from the integrations folder which is auto-configured
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the supabase client directly
export const supabase = supabaseClient;

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
      message: "Failed to connect to Supabase. Please check your connection.",
      error
    };
  }
};

// Function that can be called to check if Supabase auth can be used
export const isSupabaseAuthConfigured = () => {
  return true; // Since we're using the Supabase integration client, it's always configured
};
