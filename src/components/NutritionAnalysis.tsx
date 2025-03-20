
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNutrition } from '@/hooks/useNutrition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Skeleton } from './ui/skeleton';

interface NutritionAnalysisProps {
  days?: number;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ days = 7 }) => {
  const { useNutritionAnalysis } = useNutrition();
  const { data, isLoading, error } = useNutritionAnalysis(days);
  const { userPreferences } = useUserPreferences();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analysis</CardTitle>
          <CardDescription>Your nutrition insights for the past {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data || !data.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analysis</CardTitle>
          <CardDescription>Unable to load analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Log more meals to see your nutrition analysis.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { averages, recommendations } = data.data;
  
  if (!averages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analysis</CardTitle>
          <CardDescription>Not enough data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start logging your meals to see nutrition insights.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const macroData = [
    { name: 'Protein', value: Math.round(averages.protein), goal: (userPreferences.macroTargets.protein / 100) * userPreferences.dailyCalorieGoal / 4 },
    { name: 'Carbs', value: Math.round(averages.carbs), goal: (userPreferences.macroTargets.carbs / 100) * userPreferences.dailyCalorieGoal / 4 },
    { name: 'Fat', value: Math.round(averages.fat), goal: (userPreferences.macroTargets.fat / 100) * userPreferences.dailyCalorieGoal / 9 }
  ];
  
  const calculatePercentage = (value: number, goal: number) => {
    return (value / goal) * 100;
  };
  
  const getBarColor = (value: number, goal: number) => {
    const percentage = calculatePercentage(value, goal);
    if (percentage < 80) return 'hsl(var(--muted))';
    if (percentage > 120) return 'hsl(var(--destructive))';
    return 'hsl(var(--primary))';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Analysis</CardTitle>
        <CardDescription>Your nutrition insights for the past {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Daily Average: {Math.round(averages.calories)} calories</h3>
            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${Math.min(100, (averages.calories / userPreferences.dailyCalorieGoal) * 100)}%`,
                  backgroundColor: getBarColor(averages.calories, userPreferences.dailyCalorieGoal)
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>{userPreferences.dailyCalorieGoal} cal goal</span>
            </div>
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={macroData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis unit="g" />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => {
                    return [`${value}g (${Math.round(calculatePercentage(value, props.payload.goal))}% of goal)`, name];
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value, entry.goal)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {recommendations && recommendations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recommendations</h3>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysis;
