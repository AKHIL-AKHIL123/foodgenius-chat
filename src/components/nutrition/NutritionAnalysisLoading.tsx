
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingProps {
  days?: number;
}

export const NutritionAnalysisLoading: React.FC<LoadingProps> = ({ days = 7 }) => {
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
};
