
import { useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { useNutrition } from './useNutrition';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useNutritionAnalysisData = (days: number = 7) => {
  const { useNutritionAnalysis, useMealLogs } = useNutrition();
  const { userPreferences } = useUserPreferences();
  
  const startDate = subDays(new Date(), days);
  const { data, isLoading, error } = useNutritionAnalysis(days);
  const { 
    data: mealLogsData, 
    isLoading: logsLoading 
  } = useMealLogs(startDate.toISOString());
  
  // Process daily data
  const dailyData = useMemo(() => {
    if (!mealLogsData?.data) return [];
    
    return Array.from({ length: days }).map((_, index) => {
      const date = subDays(new Date(), days - 1 - index);
      const dayMeals = mealLogsData.data.filter(meal => 
        isSameDay(new Date(meal.date), date)
      ) || [];
      
      const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
      const totalProtein = dayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0);
      const totalCarbs = dayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
      const totalFat = dayMeals.reduce((sum, meal) => sum + meal.totalFat, 0);
      
      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        goal: userPreferences.dailyCalorieGoal
      };
    });
  }, [mealLogsData?.data, days, userPreferences.dailyCalorieGoal]);
  
  // Process meal type data
  const mealTypeData = useMemo(() => {
    if (!mealLogsData?.data) return [];
    
    return ['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
      const mealsOfType = mealLogsData.data.filter(meal => meal.mealType === mealType) || [];
      const totalCalories = mealsOfType.reduce((sum, meal) => sum + meal.totalCalories, 0);
      const avgCalories = mealsOfType.length ? Math.round(totalCalories / mealsOfType.length) : 0;
      
      return {
        name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
        calories: avgCalories,
        count: mealsOfType.length
      };
    });
  }, [mealLogsData?.data]);
  
  // Create properly typed averages object with non-optional properties
  const averages = useMemo(() => {
    // Explicitly create an object with non-optional properties by providing default values
    const protein = Number(data?.data?.averages?.protein || 0);
    const carbs = Number(data?.data?.averages?.carbs || 0);
    const fat = Number(data?.data?.averages?.fat || 0);
    
    return { protein, carbs, fat };
  }, [data?.data?.averages]);
  
  // Create macro data for the charts
  const macroData = useMemo(() => [
    { 
      name: 'Protein', 
      value: averages.protein, 
      goal: (userPreferences.macroTargets.protein / 100) * userPreferences.dailyCalorieGoal / 4 
    },
    { 
      name: 'Carbs', 
      value: averages.carbs, 
      goal: (userPreferences.macroTargets.carbs / 100) * userPreferences.dailyCalorieGoal / 4 
    },
    { 
      name: 'Fat', 
      value: averages.fat, 
      goal: (userPreferences.macroTargets.fat / 100) * userPreferences.dailyCalorieGoal / 9 
    }
  ], [averages, userPreferences.macroTargets, userPreferences.dailyCalorieGoal]);
  
  // Check if there's data to display
  const hasData = (data?.data?.averages && data.data.averages.calories > 0) || 
                  (mealLogsData?.data && mealLogsData.data.length > 0);
  
  return {
    isLoading: isLoading || logsLoading,
    hasData,
    dailyData,
    mealTypeData,
    averages,
    macroData,
    calorieGoal: userPreferences.dailyCalorieGoal,
    averageCalories: Number(data?.data?.averages?.calories || 0),
    recommendations: data?.data?.recommendations,
    macroTargets: userPreferences.macroTargets
  };
};
