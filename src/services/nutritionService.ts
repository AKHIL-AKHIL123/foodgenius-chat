
import { supabase } from '@/lib/supabase';
import { UserPreferences } from '@/utils/sampleData';
import { FoodItem, MealLog, MealPlan, NutritionInfo } from '@/types/nutrition';
import { Json, JsonCompatible } from '@/types/supabase';

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

// Food items operations
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

// Meal logging operations
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

// Meal plan operations
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

// Nutrition analysis operations
export const analyzeUserNutrition = async (userId: string, days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await getUserMealLogs(
      userId, 
      startDate.toISOString()
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    const data = result.data || [];
    
    // If no data, return empty analysis to avoid errors
    if (!data || data.length === 0) {
      return { 
        success: true, 
        data: { 
          days, 
          averages: { calories: 0, protein: 0, carbs: 0, fat: 0 }, 
          recommendations: ["Start tracking your meals to see nutritional insights."] 
        } 
      };
    }
    
    // Calculate daily averages
    const dailyTotals: Record<string, { calories: number; protein: number; carbs: number; fat: number; count: number }> = {};
    
    data.forEach((log: MealLog) => {
      const day = log.date.split('T')[0];
      if (!dailyTotals[day]) {
        dailyTotals[day] = { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
      }
      
      dailyTotals[day].calories += log.totalCalories;
      dailyTotals[day].protein += log.totalProtein;
      dailyTotals[day].carbs += log.totalCarbs;
      dailyTotals[day].fat += log.totalFat;
      dailyTotals[day].count += 1;
    });
    
    // Get user preferences for targets or use defaults
    let userPreferences;
    try {
      const { data: userPreferencesData } = await getUserPreferences(userId);
      userPreferences = userPreferencesData || { dailyCalorieGoal: 2000, macroTargets: { protein: 25, carbs: 50, fat: 25 } };
    } catch (error) {
      console.error("Error getting user preferences for analysis:", error);
      userPreferences = { dailyCalorieGoal: 2000, macroTargets: { protein: 25, carbs: 50, fat: 25 } };
    }
    
    // Generate analysis and recommendations
    const dailyEntries = Object.entries(dailyTotals);
    
    // Handle case with no entries to avoid division by zero
    if (dailyEntries.length === 0) {
      return { 
        success: true, 
        data: { 
          days, 
          averages: { calories: 0, protein: 0, carbs: 0, fat: 0 }, 
          recommendations: ["Start tracking your meals to see nutritional insights."] 
        } 
      };
    }
    
    const averages = {
      calories: dailyEntries.reduce((sum, [_, day]) => sum + day.calories, 0) / dailyEntries.length,
      protein: dailyEntries.reduce((sum, [_, day]) => sum + day.protein, 0) / dailyEntries.length,
      carbs: dailyEntries.reduce((sum, [_, day]) => sum + day.carbs, 0) / dailyEntries.length,
      fat: dailyEntries.reduce((sum, [_, day]) => sum + day.fat, 0) / dailyEntries.length
    };
    
    // Generate simple recommendations based on comparison to goals
    const recommendations = [];
    
    const calorieGoal = userPreferences.dailyCalorieGoal;
    if (averages.calories < calorieGoal * 0.9) {
      recommendations.push(`You're averaging ${Math.round(averages.calories)} calories per day, which is below your goal of ${calorieGoal}. Consider adding nutrient-dense foods to your meals.`);
    } else if (averages.calories > calorieGoal * 1.1) {
      recommendations.push(`You're averaging ${Math.round(averages.calories)} calories per day, which is above your goal of ${calorieGoal}. Consider moderating portion sizes.`);
    }
    
    const proteinGoalGrams = (userPreferences.macroTargets.protein / 100) * calorieGoal / 4;
    if (averages.protein < proteinGoalGrams * 0.9) {
      recommendations.push(`Your protein intake is below your target. Try to include more lean protein sources like chicken, fish, legumes, or tofu.`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push("You're doing well with your nutrition goals. Keep it up!");
    }
    
    return {
      success: true,
      data: {
        days,
        averages,
        recommendations
      }
    };
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    return { 
      success: true, 
      data: { 
        days, 
        averages: { calories: 0, protein: 0, carbs: 0, fat: 0 }, 
        recommendations: ["Start tracking your meals to see nutritional insights."] 
      } 
    };
  }
};
