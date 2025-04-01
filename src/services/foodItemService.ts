
import { supabase } from '@/lib/supabase';
import { FoodItem } from '@/types/nutrition';
import { Json } from '@/types/supabase';

export const searchFoodItems = async (query: string): Promise<{ data: FoodItem[] }> => {
  try {
    // Use ilike for case-insensitive search
    const { data, error } = await supabase
      .from('nutrition_data')
      .select('*')
      .ilike('food_name', `%${query}%`)
      .limit(20);
    
    if (error) throw error;
    
    const mappedData = data.map(item => ({
      id: item.id,
      name: item.food_name,
      category: (item.nutrition_info as any).category || 'general',
      nutritionInfo: {
        calories: (item.nutrition_info as any).calories || 0,
        protein: (item.nutrition_info as any).protein || 0,
        carbs: (item.nutrition_info as any).carbs || 0,
        fat: (item.nutrition_info as any).fat || 0,
        fiber: (item.nutrition_info as any).fiber,
        sugar: (item.nutrition_info as any).sugar,
        servingSize: (item.nutrition_info as any).serving_size || '100g'
      }
    }));
    
    return { data: mappedData };
  } catch (error) {
    console.error('Error searching food items:', error);
    return { data: [] };
  }
};

export const getFoodItemById = async (id: number): Promise<FoodItem | null> => {
  try {
    const { data, error } = await supabase
      .from('nutrition_data')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.food_name,
      category: (data.nutrition_info as any).category || 'general',
      nutritionInfo: {
        calories: (data.nutrition_info as any).calories || 0,
        protein: (data.nutrition_info as any).protein || 0,
        carbs: (data.nutrition_info as any).carbs || 0,
        fat: (data.nutrition_info as any).fat || 0,
        fiber: (data.nutrition_info as any).fiber,
        sugar: (data.nutrition_info as any).sugar,
        servingSize: (data.nutrition_info as any).serving_size || '100g'
      }
    };
  } catch (error) {
    console.error('Error fetching food item:', error);
    return null;
  }
};

export const addFoodItem = async (foodItem: Omit<FoodItem, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('nutrition_data')
      .insert({
        food_name: foodItem.name,
        nutrition_info: {
          category: foodItem.category,
          calories: foodItem.nutritionInfo.calories,
          protein: foodItem.nutritionInfo.protein,
          carbs: foodItem.nutritionInfo.carbs,
          fat: foodItem.nutritionInfo.fat,
          fiber: foodItem.nutritionInfo.fiber,
          sugar: foodItem.nutritionInfo.sugar,
          serving_size: foodItem.nutritionInfo.servingSize
        } as unknown as Json
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: {
        id: data.id,
        name: data.food_name,
        category: foodItem.category,
        nutritionInfo: foodItem.nutritionInfo
      } as FoodItem
    };
  } catch (error) {
    console.error('Error adding food item:', error);
    return { success: false, error };
  }
};
