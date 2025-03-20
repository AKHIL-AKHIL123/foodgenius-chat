
import React from 'react';
import NutritionAnalysis from './NutritionAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNutrition } from '@/hooks/useNutrition';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Utensils, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const NutritionDashboard: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { useMealLogs, useMealPlans } = useNutrition();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  const { data: mealLogsData } = useMealLogs(startDate.toISOString());
  const { data: mealPlansData } = useMealPlans();
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Dashboard</CardTitle>
          <CardDescription>Sign in to view your nutrition data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create an account or sign in to track your meals, analyze your nutrition, and create meal plans.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <NutritionAnalysis days={7} />
      
      <Tabs defaultValue="logs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Recent Meals</TabsTrigger>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Meals</CardTitle>
              <CardDescription>Your logged meals from the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {mealLogsData?.data && mealLogsData.data.length > 0 ? (
                <div className="space-y-4">
                  {mealLogsData.data.slice(0, 5).map(log => (
                    <div key={log.id} className="flex gap-3 items-start border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="bg-muted rounded-full p-2">
                        <Utensils size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium capitalize">{log.mealType}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarIcon size={12} />
                          {format(new Date(log.date), 'PPP')}
                        </p>
                        <p className="text-xs mt-1">
                          {log.foods.map(f => f.name).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{log.totalCalories} cal</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No meals logged in the past week. Start logging your meals to see them here.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Meal Plans</CardTitle>
              <CardDescription>Custom meal plans you've created</CardDescription>
            </CardHeader>
            <CardContent>
              {mealPlansData?.data && mealPlansData.data.length > 0 ? (
                <div className="space-y-4">
                  {mealPlansData.data.slice(0, 5).map(plan => (
                    <div key={plan.id} className="flex gap-3 items-start border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="bg-muted rounded-full p-2">
                        <Calendar size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{plan.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plan.description || `${plan.meals.length} day meal plan`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">
                          {plan.totalCalories} cal/day
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No meal plans created yet. Create a meal plan to see it here.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionDashboard;
