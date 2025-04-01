
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaloriesSummary } from './CaloriesSummary';
import { CaloriesChart } from './CaloriesChart';
import { MacrosChart } from './MacrosChart';
import { MealTypeChart } from './MealTypeChart';
import { useNutritionAnalysisData } from '@/hooks/useNutritionAnalysisData';
import { NutritionAnalysisLoading } from './NutritionAnalysisLoading';
import { NutritionAnalysisEmpty } from './NutritionAnalysisEmpty';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Lightbulb, BarChart, PieChart, Calendar } from 'lucide-react';
import { ensureCompleteMacros } from '@/types/nutrition';

interface NutritionOverviewProps {
  days?: number;
  showRecommendations?: boolean;
}

const NutritionOverview: React.FC<NutritionOverviewProps> = ({
  days = 7,
  showRecommendations = true
}) => {
  const { isLoading, hasData, dailyData, mealTypeData, averages, macroData, averageCalories, recommendations, calorieGoal } = 
    useNutritionAnalysisData(days);
    
  const { userPreferences } = useUserPreferences();
  
  if (isLoading) return <NutritionAnalysisLoading />;
  if (!hasData) return <NutritionAnalysisEmpty calorieGoal={calorieGoal} />;
  
  // Ensure we have non-optional macro values
  const macroAverages = ensureCompleteMacros(averages);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CaloriesSummary 
          averageCalories={averageCalories} 
          calorieGoal={userPreferences?.dailyCalorieGoal || 2000} 
        />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-1.5">
              <PieChart size={16} className="text-primary" />
              Macronutrient Distribution
            </CardTitle>
            <CardDescription>Average daily macros compared to targets</CardDescription>
          </CardHeader>
          <CardContent>
            <MacrosChart 
              macroData={macroData}
              averages={macroAverages}
              macroTargets={userPreferences?.macroTargets || { protein: 25, carbs: 50, fat: 25 }}
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="calories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calories" className="gap-2">
            <BarChart size={16} />
            <span className="hidden sm:inline">Calorie Trends</span>
            <span className="sm:hidden">Calories</span>
          </TabsTrigger>
          <TabsTrigger value="meal-types" className="gap-2">
            <Calendar size={16} />
            <span className="hidden sm:inline">Meal Type Analysis</span>
            <span className="sm:hidden">Meals</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calories" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-1.5">
                <BarChart size={16} className="text-primary" />
                Daily Calorie Intake
              </CardTitle>
              <CardDescription>Your calorie intake for the past {days} days</CardDescription>
            </CardHeader>
            <CardContent>
              <CaloriesChart 
                dailyData={dailyData}
                averageCalories={averageCalories}
                calorieGoal={userPreferences?.dailyCalorieGoal || 2000}
                days={days}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meal-types" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Calendar size={16} className="text-primary" />
                Meal Type Analysis
              </CardTitle>
              <CardDescription>Average calories by meal type</CardDescription>
            </CardHeader>
            <CardContent>
              <MealTypeChart mealTypeData={mealTypeData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showRecommendations && recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-1.5">
              <Lightbulb size={16} className="text-primary" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-sm">
                  • {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionOverview;
