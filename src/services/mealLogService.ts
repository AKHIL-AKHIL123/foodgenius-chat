
import { supabase } from '@/lib/supabase';
import { MealLog } from '@/types/nutrition';
import { Json } from '@/types/supabase';

export const logMeal = async (userId: string, mealLog: Omit<MealLog, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('meal_logs')
      .insert({
        user_id: userId,
        meal_data: mealLog as unknown as Json,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { 
      success: true, 
      data: { 
        id: data.id, 
        ...data.meal_data as unknown as Omit<MealLog, 'id'>
      } as MealLog 
    };
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
    
    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }
    
    return { 
      success: true, 
      data: data.map(entry => ({
        id: entry.id,
        ...(entry.meal_data as unknown as Omit<MealLog, 'id'>)
      })) as MealLog[]
    };
  } catch (error) {
    console.error('Error fetching meal logs:', error);
    return { success: false, error };
  }
};
