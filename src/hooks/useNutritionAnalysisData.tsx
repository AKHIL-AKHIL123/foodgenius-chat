
import { useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { useNutrition } from './useNutrition';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { MacroNutrients, ensureCompleteMacros } from '@/types/nutrition';

export const useNutritionAnalysisData = (days: number = 7) => {
  const { useNutritionAnalysis, useMealLogs } = useNutrition();
  const { userPreferences } = useUserPreferences();
  
  const startDate = subDays(new Date(), days);
  const { data, isLoading, error } = useNutritionAnalysis(days);
  const { 
    data: mealLogsData, 
    isLoading: logsLoading 
  } = useMealLogs(startDate.toISOString());
  
  const dailyData = useMemo(() => {
    if (!mealLogsData?.data) return [];
    
    return Array.from({ length: days }).map((_, index) => {
      const date = subDays(new Date(), days - 1 - index);
      const dayMeals = mealLogsData.data.filter(meal => 
        isSameDay(new Date(meal.date), date)
      ) || [];
      
      const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
      const totalProtein = dayMeals.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0);
      const totalCarbs = dayMeals.reduce((sum, meal) => sum + (meal.totalCarbs || 0), 0);
      const totalFat = dayMeals.reduce((sum, meal) => sum + (meal.totalFat || 0), 0);
      
      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        goal: userPreferences?.dailyCalorieGoal || 2000
      };
    });
  }, [mealLogsData?.data, days, userPreferences?.dailyCalorieGoal]);
  
  const mealTypeData = useMemo(() => {
    if (!mealLogsData?.data) return [];
    
    return ['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
      const mealsOfType = mealLogsData.data.filter(meal => meal.mealType === mealType) || [];
      const totalCalories = mealsOfType.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
      const avgCalories = mealsOfType.length ? Math.round(totalCalories / mealsOfType.length) : 0;
      
      return {
        name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
        calories: avgCalories,
        count: mealsOfType.length
      };
    });
  }, [mealLogsData?.data]);
  
  const averages = useMemo(() => {
    // Ensure we get complete MacroNutrients object with non-optional properties
    return ensureCompleteMacros({
      protein: Number(data?.data?.averages?.protein ?? 0),
      carbs: Number(data?.data?.averages?.carbs ?? 0),
      fat: Number(data?.data?.averages?.fat ?? 0)
    });
  }, [data?.data?.averages]);
  
  const macroData = useMemo(() => [
    { 
      name: 'Protein', 
      value: averages.protein, 
      goal: ((userPreferences?.macroTargets?.protein || 0) / 100) * (userPreferences?.dailyCalorieGoal || 2000) / 4 
    },
    { 
      name: 'Carbs', 
      value: averages.carbs, 
      goal: ((userPreferences?.macroTargets?.carbs || 0) / 100) * (userPreferences?.dailyCalorieGoal || 2000) / 4 
    },
    { 
      name: 'Fat', 
      value: averages.fat, 
      goal: ((userPreferences?.macroTargets?.fat || 0) / 100) * (userPreferences?.dailyCalorieGoal || 2000) / 9 
    }
  ], [averages, userPreferences?.macroTargets, userPreferences?.dailyCalorieGoal]);
  
  const hasData = (data?.data?.averages && data.data.averages.calories > 0) || 
                  (mealLogsData?.data && mealLogsData.data.length > 0);
  
  const calorieGoal = userPreferences?.dailyCalorieGoal || 2000;
  
  return {
    isLoading: isLoading || logsLoading,
    hasData,
    dailyData,
    mealTypeData,
    averages,
    macroData,
    calorieGoal,
    averageCalories: Number(data?.data?.averages?.calories || 0),
    recommendations: data?.data?.recommendations || [],
    macroTargets: userPreferences?.macroTargets || { protein: 25, carbs: 50, fat: 25 }
  };
};
