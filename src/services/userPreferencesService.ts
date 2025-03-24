
import { supabase } from '@/lib/supabase';
import { UserPreferences } from '@/utils/sampleData';
import { Json } from '@/types/supabase';

// User preferences operations
export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: userId, 
        preferences: preferences as unknown as Json,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id' 
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error };
  }
};

export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle case where no record exists
    
    if (error) throw error;
    
    if (!data) {
      return { success: false, error: "No preferences found" };
    }
    
    return { success: true, data: data?.preferences as unknown as UserPreferences };
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return { success: false, error };
  }
};
