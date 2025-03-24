
import { getUserMealLogs } from './mealLogService';
import { getUserPreferences } from './userPreferencesService';
import { MealLog } from '@/types/nutrition';

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
