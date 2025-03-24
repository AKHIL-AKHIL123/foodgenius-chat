
import { supabase } from '@/lib/supabase';
import { FoodItem, NutritionInfo } from '@/types/nutrition';
import { Json } from '@/types/supabase';

export const searchFoodItems = async (query: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('nutrition_data')
      .select('*')
      .ilike('food_name', `%${query}%`)
      .limit(limit);
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: data.map(item => ({
        id: item.id,
        name: item.food_name,
        nutritionInfo: item.nutrition_info as unknown as NutritionInfo,
        category: (item.nutrition_info as any).category || 'general'
      })) 
    };
  } catch (error) {
    console.error('Error searching food items:', error);
    return { success: false, error };
  }
};

export const getFoodItemById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('nutrition_data')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: {
        id: data.id,
        name: data.food_name,
        nutritionInfo: data.nutrition_info as unknown as NutritionInfo,
        category: (data.nutrition_info as any).category || 'general'
      } as FoodItem
    };
  } catch (error) {
    console.error('Error fetching food item:', error);
    return { success: false, error };
  }
};

export const addFoodItem = async (foodItem: Omit<FoodItem, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('nutrition_data')
      .insert({
        food_name: foodItem.name,
        nutrition_info: {
          ...foodItem.nutritionInfo,
          category: foodItem.category
        } as unknown as Json,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: {
        id: data.id,
        name: data.food_name,
        nutritionInfo: data.nutrition_info as unknown as NutritionInfo,
        category: (data.nutrition_info as any).category || 'general'
      } as FoodItem
    };
  } catch (error) {
    console.error('Error adding food item:', error);
    return { success: false, error };
  }
};
