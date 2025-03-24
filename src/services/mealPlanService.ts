
import { supabase } from '@/lib/supabase';
import { MealPlan } from '@/types/nutrition';
import { Json } from '@/types/supabase';

export const saveMealPlan = async (userId: string, mealPlan: Omit<MealPlan, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        plan_name: mealPlan.name,
        plan_data: mealPlan as unknown as Json,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { 
      success: true, 
      data: { 
        id: data.id, 
        ...(data.plan_data as unknown as Omit<MealPlan, 'id'>)
      } as MealPlan 
    };
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
    return { 
      success: true, 
      data: data.map(plan => ({
        id: plan.id,
        ...(plan.plan_data as unknown as Omit<MealPlan, 'id'>)
      })) as MealPlan[]
    };
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return { success: false, error };
  }
};

export const getMealPlanById = async (userId: string, planId: number) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return { 
      success: true, 
      data: { 
        id: data.id, 
        ...(data.plan_data as unknown as Omit<MealPlan, 'id'>)
      } as MealPlan 
    };
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return { success: false, error };
  }
};
