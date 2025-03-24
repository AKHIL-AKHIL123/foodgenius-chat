
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NutritionAnalysisLoading } from './nutrition/NutritionAnalysisLoading';
import { NutritionAnalysisEmpty } from './nutrition/NutritionAnalysisEmpty';
import { CaloriesSummary } from './nutrition/CaloriesSummary';
import { CaloriesChart } from './nutrition/CaloriesChart';
import { MacrosChart } from './nutrition/MacrosChart';
import { MealTypeChart } from './nutrition/MealTypeChart';
import { TrendsChart } from './nutrition/TrendsChart';
import { useNutritionAnalysisData } from '@/hooks/useNutritionAnalysisData';

interface NutritionAnalysisProps {
  days?: number;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ days = 7 }) => {
  const [activeTab, setActiveTab] = useState<string>('calories');
  const { 
    isLoading,
    hasData,
    dailyData,
    mealTypeData,
    averages,
    macroData,
    calorieGoal,
    averageCalories,
    recommendations,
    macroTargets
  } = useNutritionAnalysisData(days);
  
  if (isLoading) {
    return <NutritionAnalysisLoading days={days} />;
  }
  
  if (!hasData) {
    return <NutritionAnalysisEmpty calorieGoal={calorieGoal} />;
  }
  
  // Ensure that averages has all required properties as non-optional
  const ensuredAverages = {
    protein: averages.protein,
    carbs: averages.carbs,
    fat: averages.fat
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Calorie & Nutrition Tracker</CardTitle>
        <CardDescription>Your nutrition insights for the past {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CaloriesSummary 
            averageCalories={averageCalories} 
            calorieGoal={calorieGoal} 
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
                averageCalories={averageCalories}
                calorieGoal={calorieGoal}
                days={days}
              />
            </TabsContent>
            
            <TabsContent value="macros" className="pt-2">
              <MacrosChart 
                macroData={macroData}
                averages={ensuredAverages}
                macroTargets={macroTargets}
              />
            </TabsContent>
            
            <TabsContent value="meals" className="pt-2">
              <MealTypeChart mealTypeData={mealTypeData} />
            </TabsContent>
            
            <TabsContent value="trends" className="pt-2">
              <TrendsChart 
                dailyData={dailyData}
                recommendations={recommendations}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysis;
