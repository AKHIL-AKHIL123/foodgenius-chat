
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MealPlan } from '@/utils/sampleData';
import { Badge } from '@/components/ui/badge';
import { Utensils, Clock, Calendar } from 'lucide-react';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  className?: string;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">{mealPlan.name}</CardTitle>
          <div className="space-x-1">
            {mealPlan.dietaryTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="bg-background text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Macros summary */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Calories</div>
              <div className="font-medium">{mealPlan.totalCalories}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Protein</div>
              <div className="font-medium">{mealPlan.totalMacros.protein}g</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Carbs</div>
              <div className="font-medium">{mealPlan.totalMacros.carbs}g</div>
            </div>
          </div>
          
          {/* Meal breakdown */}
          <div className="space-y-3">
            {mealPlan.meals.map((meal, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils size={14} className="text-primary" />
                  <h4 className="text-sm font-medium capitalize">{meal.type}</h4>
                </div>
                <div className="space-y-1">
                  {meal.foods.map(food => (
                    <div key={food.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{food.emoji}</span>
                        <span>{food.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{food.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3">
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Calendar size={14} />
          <span>Add to Planner</span>
        </Button>
        <Button size="sm" className="h-8 gap-1">
          <Clock size={14} />
          <span>Use Today</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;
