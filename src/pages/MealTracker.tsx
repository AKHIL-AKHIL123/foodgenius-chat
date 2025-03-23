
import React, { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNutrition } from '@/hooks/useNutrition';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Skeleton } from '@/components/ui/skeleton';
import { MealForm } from '@/components/meal-tracker/MealForm';
import { MealHistory } from '@/components/meal-tracker/MealHistory';

// Lazy load the NutritionAnalysis component for better performance
const NutritionAnalysis = lazy(() => 
  import('@/components/NutritionAnalysis').then(module => ({
    default: module.default
  }))
);

const MealTracker: React.FC = () => {
  const { userPreferences, loading: preferencesLoading } = useUserPreferences();
  const { useMealLogs } = useNutrition();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  const { 
    data: mealLogsData, 
    isLoading: logsLoading, 
    error: logsError 
  } = useMealLogs(startDate.toISOString());
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <Header />
      
      {preferencesLoading ? (
        <div className="container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <div className="container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log Your Meal</CardTitle>
                <CardDescription>Track your nutrition by logging what you eat</CardDescription>
              </CardHeader>
              <MealForm />
            </Card>
            
            <Suspense fallback={
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <Skeleton className="h-[350px] w-full px-6" />
              </Card>
            }>
              <NutritionAnalysis days={7} />
            </Suspense>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Meal History</CardTitle>
                <CardDescription>Your logged meals from the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[800px] overflow-y-auto">
                <MealHistory 
                  mealLogsData={mealLogsData} 
                  logsLoading={logsLoading} 
                  logsError={logsError} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealTracker;
