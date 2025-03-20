
import React from 'react';
import { FoodNutrition } from '@/utils/sampleData';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  food: FoodNutrition;
  className?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, className }) => {
  return (
    <div className={cn(
      "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card",
      className
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {food.emoji && <span className="text-xl">{food.emoji}</span>}
            {food.name}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {food.servingSize}
            </span>
          </h3>
          <div className="text-lg font-medium text-slate-700 dark:text-slate-300">
            {food.calories} <span className="text-xs text-muted-foreground">kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="text-xs text-muted-foreground mb-1">Protein</span>
            <span className="font-medium">{food.macros.protein}g</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="text-xs text-muted-foreground mb-1">Carbs</span>
            <span className="font-medium">{food.macros.carbs}g</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="text-xs text-muted-foreground mb-1">Fat</span>
            <span className="font-medium">{food.macros.fat}g</span>
          </div>
        </div>

        {(food.macros.fiber !== undefined || food.macros.sugar !== undefined) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {food.macros.fiber !== undefined && (
              <div className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Fiber: {food.macros.fiber}g
              </div>
            )}
            {food.macros.sugar !== undefined && (
              <div className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Sugar: {food.macros.sugar}g
              </div>
            )}
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Key Nutrients</h4>
          <div className="space-y-2">
            {food.nutrients.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{nutrient.name}</span>
                    <span>{nutrient.amount}{nutrient.unit} {nutrient.percentDailyValue && `(${nutrient.percentDailyValue}% DV)`}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-primary" 
                      style={{ 
                        width: `${Math.min(100, (nutrient.percentDailyValue || 0) * 1.5)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Health Benefits</h4>
          <ul className="space-y-1">
            {food.benefits.map((benefit, index) => (
              <li key={index} className="text-xs text-slate-700 dark:text-slate-300 flex items-start">
                <span className="text-primary mr-1.5">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
