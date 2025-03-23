import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNutrition } from '@/hooks/useNutrition';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, isSameDay } from 'date-fns';
import { NutritionAnalysisLoading } from './nutrition/NutritionAnalysisLoading';
import { NutritionAnalysisEmpty } from './nutrition/NutritionAnalysisEmpty';
import { CaloriesSummary } from './nutrition/CaloriesSummary';
import { CaloriesChart } from './nutrition/CaloriesChart';
import { MacrosChart } from './nutrition/MacrosChart';
import { MealTypeChart } from './nutrition/MealTypeChart';
import { TrendsChart } from './nutrition/TrendsChart';

interface NutritionAnalysisProps {
  days?: number;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ days = 7 }) => {
  const { useNutritionAnalysis, useMealLogs } = useNutrition();
  const { data, isLoading, error } = useNutritionAnalysis(days);
  const { userPreferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<string>('calories');
  
  const startDate = subDays(new Date(), days);
  const { data: mealLogsData, isLoading: logsLoading } = useMealLogs(startDate.toISOString());
  
  if (isLoading || logsLoading) {
    return <NutritionAnalysisLoading days={days} />;
  }
  
  const dailyData = Array.from({ length: days }).map((_, index) => {
    const date = subDays(new Date(), days - 1 - index);
    const dayMeals = mealLogsData?.data?.filter(meal => 
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
  
  const mealTypeData = ['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
    const mealsOfType = mealLogsData?.data?.filter(meal => meal.mealType === mealType) || [];
    const totalCalories = mealsOfType.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const avgCalories = mealsOfType.length ? Math.round(totalCalories / mealsOfType.length) : 0;
    
    return {
      name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      calories: avgCalories,
      count: mealsOfType.length
    };
  });
  
  if ((!data?.data?.averages || data.data.averages.calories === 0) && 
      (!mealLogsData?.data || mealLogsData.data.length === 0)) {
    return <NutritionAnalysisEmpty calorieGoal={userPreferences.dailyCalorieGoal} />;
  }
  
  const averages = {
    protein: Number(data?.data?.averages?.protein || 0),
    carbs: Number(data?.data?.averages?.carbs || 0),
    fat: Number(data?.data?.averages?.fat || 0)
  };
  
  const macroData = [
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
  ];
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Calorie & Nutrition Tracker</CardTitle>
        <CardDescription>Your nutrition insights for the past {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CaloriesSummary 
            averageCalories={data?.data?.averages?.calories || 0} 
            calorieGoal={userPreferences.dailyCalorieGoal} 
          />
          
          <Tabs defaultValue="calories" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 h-9 mb-4">
              <TabsTrigger value="calories">Calories</TabsTrigger>
              <TabsTrigger value="macros">Macros</TabsTrigger>
              <TabsTrigger value="meals">By Meal</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calories" className="pt-2">
              <CaloriesChart 
                dailyData={dailyData}
                averageCalories={data?.data?.averages?.calories || 0}
                calorieGoal={userPreferences.dailyCalorieGoal}
                days={days}
              />
            </TabsContent>
            
            <TabsContent value="macros" className="pt-2">
              <MacrosChart 
                macroData={macroData}
                averages={averages}
                macroTargets={userPreferences.macroTargets}
              />
            </TabsContent>
            
            <TabsContent value="meals" className="pt-2">
              <MealTypeChart mealTypeData={mealTypeData} />
            </TabsContent>
            
            <TabsContent value="trends" className="pt-2">
              <TrendsChart 
                dailyData={dailyData}
                recommendations={data?.data?.recommendations}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysis;
