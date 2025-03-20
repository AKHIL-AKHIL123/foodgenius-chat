
import { supabase } from '@/lib/supabase';
import { UserPreferences } from '@/utils/sampleData';

// User preferences operations
export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: userId, 
        preferences: preferences 
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
      .single();
    
    if (error) throw error;
    return { success: true, data: data?.preferences };
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return { success: false, error };
  }
};

// Food tracking operations
export const logMeal = async (userId: string, mealData: any) => {
  try {
    const { error } = await supabase
      .from('meal_logs')
      .insert({
        user_id: userId,
        meal_data: mealData,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging meal:', error);
    return { success: false, error };
  }
};

export const getUserMealLogs = async (userId: string, startDate?: string, endDate?: string) => {
  try {
    let query = supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching meal logs:', error);
    return { success: false, error };
  }
};

// Save meal plans
export const saveMealPlan = async (userId: string, planName: string, mealPlan: any) => {
  try {
    const { error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        plan_name: planName,
        plan_data: mealPlan,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving meal plan:', error);
    return { success: false, error };
  }
};

export const getUserMealPlans = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return { success: false, error };
  }
};
