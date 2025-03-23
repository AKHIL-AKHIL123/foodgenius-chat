
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyProps {
  calorieGoal: number;
}

export const NutritionAnalysisEmpty: React.FC<EmptyProps> = ({ calorieGoal }) => {
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
            Your daily calorie goal is set to {calorieGoal} calories.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
