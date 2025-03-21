import React, { useState } from 'react';
import { FoodNutrition } from '@/utils/sampleData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Clock, Plus } from 'lucide-react';
import { FoodItem } from '@/types/nutrition';
import FoodDetailModal from './FoodDetailModal';
import AddToMealPlanModal from './AddToMealPlanModal';

interface FoodCardProps {
  food: FoodNutrition | FoodItem;
  className?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, className }) => {
  const [trackNowModalOpen, setTrackNowModalOpen] = useState(false);
  const [addToMealModalOpen, setAddToMealModalOpen] = useState(false);
  
  // Convert FoodNutrition to FoodItem if needed
  const foodItem: FoodItem = 'nutritionInfo' in food 
    ? food as FoodItem 
    : {
        name: food.name,
        category: 'nutritionInfo' in food ? food.category || 'general' : 'general',
        nutritionInfo: {
          calories: food.calories,
          protein: food.macros.protein,
          carbs: food.macros.carbs,
          fat: food.macros.fat,
          fiber: food.macros.fiber,
          sugar: food.macros.sugar,
          servingSize: food.servingSize
        }
      };
  
  const handleTrackNow = () => {
    setTrackNowModalOpen(true);
  };
  
  const handleAddToMeal = () => {
    setAddToMealModalOpen(true);
  };
  
  return (
    <>
      <div className={cn(
        "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card",
        className
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {('emoji' in food) && food.emoji && <span className="text-xl">{food.emoji}</span>}
              {food.name}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {'servingSize' in food ? food.servingSize : food.nutritionInfo.servingSize}
              </span>
            </h3>
            <div className="text-lg font-medium text-slate-700 dark:text-slate-300">
              {'calories' in food ? food.calories : food.nutritionInfo.calories} <span className="text-xs text-muted-foreground">kcal</span>
            </div>
          </div>

          {/* Dietary tags */}
          {('dietaryTags' in food) && food.dietaryTags && food.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {food.dietaryTags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
              <span className="text-xs text-muted-foreground mb-1">Protein</span>
              <span className="font-medium">
                {('macros' in food ? food.macros.protein : food.nutritionInfo.protein)}g
              </span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
              <span className="text-xs text-muted-foreground mb-1">Carbs</span>
              <span className="font-medium">
                {('macros' in food ? food.macros.carbs : food.nutritionInfo.carbs)}g
              </span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
              <span className="text-xs text-muted-foreground mb-1">Fat</span>
              <span className="font-medium">
                {('macros' in food ? food.macros.fat : food.nutritionInfo.fat)}g
              </span>
            </div>
          </div>

          {(('macros' in food && (food.macros.fiber !== undefined || food.macros.sugar !== undefined)) || 
            ('nutritionInfo' in food && (food.nutritionInfo.fiber !== undefined || food.nutritionInfo.sugar !== undefined))) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(('macros' in food && food.macros.fiber !== undefined) || 
                ('nutritionInfo' in food && food.nutritionInfo.fiber !== undefined)) && (
                <div className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Fiber: {('macros' in food ? food.macros.fiber : food.nutritionInfo.fiber)}g
                </div>
              )}
              {(('macros' in food && food.macros.sugar !== undefined) || 
                ('nutritionInfo' in food && food.nutritionInfo.sugar !== undefined)) && (
                <div className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Sugar: {('macros' in food ? food.macros.sugar : food.nutritionInfo.sugar)}g
                </div>
              )}
            </div>
          )}

          {'nutrients' in food && food.nutrients && (
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
          )}

          {'benefits' in food && food.benefits && (
            <div className="mb-4">
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
          )}

          {'mealSuggestions' in food && food.mealSuggestions && food.mealSuggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Utensils size={14} className="text-primary" />
                Suggested for
              </h4>
              <div className="flex flex-wrap gap-1">
                {food.mealSuggestions.map(meal => (
                  <Badge key={meal} variant="secondary" className="capitalize">
                    {meal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {'pairsWith' in food && food.pairsWith && food.pairsWith.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Pairs well with</h4>
              <div className="flex flex-wrap gap-2">
                {food.pairsWith.map(pairing => (
                  <Badge key={pairing} variant="outline" className="flex items-center gap-1 px-2 py-1">
                    {pairing === 'apple' && '🍎'}
                    {pairing === 'banana' && '🍌'}
                    {pairing === 'broccoli' && '🥦'}
                    {pairing === 'chicken' && '🍗'}
                    {pairing === 'salmon' && '🐟'}
                    {pairing}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 p-3">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddToMealModalOpen(true)}>
            <Clock size={14} />
            <span>Add to Meal</span>
          </Button>
          <Button size="sm" className="gap-1" onClick={() => setTrackNowModalOpen(true)}>
            <Plus size={14} />
            <span>Track Now</span>
          </Button>
        </div>
      </div>
      
      {trackNowModalOpen && (
        <FoodDetailModal 
          food={foodItem}
          isOpen={trackNowModalOpen} 
          onClose={() => setTrackNowModalOpen(false)} 
        />
      )}
      
      {addToMealModalOpen && (
        <AddToMealPlanModal 
          food={foodItem}
          isOpen={addToMealModalOpen} 
          onClose={() => setAddToMealModalOpen(false)} 
        />
      )}
    </>
  );
};

export default FoodCard;
