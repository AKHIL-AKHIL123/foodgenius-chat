
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

interface CaloriesSummaryProps {
  averageCalories: number;
  calorieGoal: number;
}

export const CaloriesSummary: React.FC<CaloriesSummaryProps> = ({ 
  averageCalories, 
  calorieGoal 
}) => {
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
    const percentage = calculatePercentage(averageCalories, calorieGoal);
    
    if (percentage < 80) return { 
      label: 'Under Goal', 
      color: 'text-blue-500', 
      icon: <TrendingDown className="h-4 w-4" /> 
    };
    if (percentage > 120) return { 
      label: 'Over Goal', 
      color: 'text-red-500', 
      icon: <TrendingUp className="h-4 w-4" /> 
    };
    return { 
      label: 'On Track', 
      color: 'text-green-500', 
      icon: <Activity className="h-4 w-4" /> 
    };
  };

  const calorieStatus = getCalorieStatus();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center gap-2">
          Daily Average: {Math.round(averageCalories)} calories
          <span className="text-xs text-muted-foreground">(Goal: {calorieGoal})</span>
        </h3>
        <Badge 
          variant="outline" 
          className={`${calorieStatus.color} flex items-center gap-1`}
        >
          {calorieStatus.icon}
          {calorieStatus.label}
        </Badge>
      </div>
      <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ 
            width: `${Math.min(100, (averageCalories / calorieGoal) * 100)}%`,
            backgroundColor: getBarColor(averageCalories, calorieGoal)
          }}
        />
      </div>
    </div>
  );
};
