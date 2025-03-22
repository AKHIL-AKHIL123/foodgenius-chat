import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNutrition } from '@/hooks/useNutrition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, ComposedChart } from 'recharts';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, isSameDay } from 'date-fns';
import { Badge } from './ui/badge';
import { Info, TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analysis</CardTitle>
          <CardDescription>Your nutrition insights for the past {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
  
  const macroData = [
    { 
      name: 'Protein', 
      value: data?.data?.averages?.protein || 0, 
      goal: (userPreferences.macroTargets.protein / 100) * userPreferences.dailyCalorieGoal / 4 
    },
    { 
      name: 'Carbs', 
      value: data?.data?.averages?.carbs || 0, 
      goal: (userPreferences.macroTargets.carbs / 100) * userPreferences.dailyCalorieGoal / 4 
    },
    { 
      name: 'Fat', 
      value: data?.data?.averages?.fat || 0, 
      goal: (userPreferences.macroTargets.fat / 100) * userPreferences.dailyCalorieGoal / 9 
    }
  ];
  
  const calculatePercentage = (value: number, goal: number) => {
    if (goal <= 0) return 0;
    return (value / goal) * 100;
  };
  
  const getBarColor = (value: number, goal: number) => {
    const percentage = calculatePercentage(value, goal);
    if (percentage < 80) return 'hsl(var(--muted))';
    if (percentage > 120) return 'hsl(var(--destructive))';
    return 'hsl(var(--primary))';
  };
  
  const getCalorieStatus = () => {
    const avgCalories = data?.data?.averages?.calories || 0;
    const goal = userPreferences.dailyCalorieGoal;
    const percentage = calculatePercentage(avgCalories, goal);
    
    if (percentage < 80) return { label: 'Under Goal', color: 'text-blue-500', icon: <TrendingDown className="h-4 w-4" /> };
    if (percentage > 120) return { label: 'Over Goal', color: 'text-red-500', icon: <TrendingUp className="h-4 w-4" /> };
    return { label: 'On Track', color: 'text-green-500', icon: <Activity className="h-4 w-4" /> };
  };
  
  const calorieStatus = getCalorieStatus();
  
  if ((!data?.data?.averages || data.data.averages.calories === 0) && 
      (!mealLogsData?.data || mealLogsData.data.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analysis</CardTitle>
          <CardDescription>Start tracking your meals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-2">
              No meal data available yet. Start logging your meals to see nutrition insights.
            </p>
            <p className="text-sm text-muted-foreground">
              Your daily calorie goal is set to {userPreferences.dailyCalorieGoal} calories.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Calorie & Nutrition Tracker</CardTitle>
            <CardDescription>Your nutrition insights for the past {days} days</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${calorieStatus.color} flex items-center gap-1`}
          >
            {calorieStatus.icon}
            {calorieStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              Daily Average: {Math.round(data?.data?.averages?.calories || 0)} calories
              <span className="text-xs text-muted-foreground">(Goal: {userPreferences.dailyCalorieGoal})</span>
            </h3>
            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${Math.min(100, ((data?.data?.averages?.calories || 0) / userPreferences.dailyCalorieGoal) * 100)}%`,
                  backgroundColor: getBarColor(data?.data?.averages?.calories || 0, userPreferences.dailyCalorieGoal)
                }}
              />
            </div>
          </div>
          
          <Tabs defaultValue="calories" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 h-9 mb-4">
              <TabsTrigger value="calories">Calories</TabsTrigger>
              <TabsTrigger value="macros">Macros</TabsTrigger>
              <TabsTrigger value="meals">By Meal</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calories" className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <Tooltip 
                      formatter={(value: number) => [`${value} calories`, 'Calories']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="calories" 
                      fill="hsl(var(--primary))" 
                      name="Calories" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2} 
                      name="Daily Goal" 
                      dot={false} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Average</div>
                  <div className="text-lg font-semibold">
                    {Math.round(data?.data?.averages?.calories || 0)} cal
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Goal</div>
                  <div className="text-lg font-semibold">
                    {userPreferences.dailyCalorieGoal} cal
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Highest Day</div>
                  <div className="text-lg font-semibold">
                    {Math.max(...dailyData.map(day => day.calories || 0))} cal
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Days on Track</div>
                  <div className="text-lg font-semibold">
                    {dailyData.filter(day => 
                      day.calories >= userPreferences.dailyCalorieGoal * 0.8 && 
                      day.calories <= userPreferences.dailyCalorieGoal * 1.2
                    ).length}/{days}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="macros" className="pt-2">
              <div className="h-[300px]">
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
                        return [`${Math.round(value)}g (${Math.round(calculatePercentage(value, props.payload.goal))}% of goal)`, name];
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Protein</div>
                  <div className="text-lg font-semibold">
                    {Math.round(data?.data?.averages?.protein || 0)}g
                  </div>
                  <div className="text-xs mt-1 flex justify-between">
                    <span>{Math.round(userPreferences.macroTargets.protein)}% of calories</span>
                    <span>{Math.round(calculatePercentage(data?.data?.averages?.protein || 0, macroData[0].goal))}% of goal</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Carbs</div>
                  <div className="text-lg font-semibold">
                    {Math.round(data?.data?.averages?.carbs || 0)}g
                  </div>
                  <div className="text-xs mt-1 flex justify-between">
                    <span>{Math.round(userPreferences.macroTargets.carbs)}% of calories</span>
                    <span>{Math.round(calculatePercentage(data?.data?.averages?.carbs || 0, macroData[1].goal))}% of goal</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Fat</div>
                  <div className="text-lg font-semibold">
                    {Math.round(data?.data?.averages?.fat || 0)}g
                  </div>
                  <div className="text-xs mt-1 flex justify-between">
                    <span>{Math.round(userPreferences.macroTargets.fat)}% of calories</span>
                    <span>{Math.round(calculatePercentage(data?.data?.averages?.fat || 0, macroData[2].goal))}% of goal</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="meals" className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mealTypeData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} calories`, 'Avg. Calories']}
                    />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {mealTypeData.map((meal) => (
                  <div key={meal.name} className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">{meal.name}</div>
                    <div className="text-lg font-semibold">
                      {meal.calories} cal
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {meal.count} meals logged
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="calories" 
                      name="Calories" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="protein" 
                      name="Protein (g)" 
                      stroke="hsl(var(--destructive))" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="carbs" 
                      name="Carbs (g)" 
                      stroke="hsl(var(--accent-foreground))" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="fat" 
                      name="Fat (g)" 
                      stroke="hsl(var(--muted-foreground))" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {data?.data?.recommendations && data.data.recommendations.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {data.data.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysis;
