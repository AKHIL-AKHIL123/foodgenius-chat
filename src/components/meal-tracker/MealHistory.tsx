
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { MealLog } from '@/types/nutrition';
import { Badge } from '@/components/ui/badge';

interface MealHistoryProps {
  mealLogsData: { data: MealLog[] } | undefined;
  logsLoading: boolean;
  logsError: unknown;
}

export const MealHistory: React.FC<MealHistoryProps> = ({ 
  mealLogsData, 
  logsLoading, 
  logsError 
}) => {
  if (logsLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  
  if (logsError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading meal history</AlertTitle>
        <AlertDescription>
          There was a problem loading your meal history. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!mealLogsData?.data || mealLogsData.data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No meals logged in the past 30 days
        </p>
      </div>
    );
  }
  
  const mealsByDate = mealLogsData.data.reduce((acc: Record<string, MealLog[]>, meal: MealLog) => {
    const date = format(new Date(meal.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {});
  
  return (
    <div className="space-y-6">
      {Object.entries(mealsByDate)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, meals]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <h3 className="text-sm font-medium">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>
            
            <div className="pl-3 space-y-2">
              {meals.sort((a, b) => {
                const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
                return (mealOrder as any)[a.mealType] - (mealOrder as any)[b.mealType];
              }).map((meal: MealLog) => (
                <div key={meal.id} className="bg-muted/50 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="capitalize">
                      {meal.mealType}
                    </Badge>
                    <span className="text-sm font-medium">{Math.round(meal.totalCalories)} cal</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {meal.foods.map(f => f.name).join(', ')}
                  </div>
                  <div className="mt-2 text-xs flex gap-3">
                    <span>P: {Math.round(meal.totalProtein)}g</span>
                    <span>C: {Math.round(meal.totalCarbs)}g</span>
                    <span>F: {Math.round(meal.totalFat)}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
};
