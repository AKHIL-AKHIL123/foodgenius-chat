
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { FoodItem, MealLog } from '@/types/nutrition';
import { useNutrition } from '@/hooks/useNutrition';
import { useToast } from '@/hooks/use-toast';

interface FoodDetailModalProps {
  food: FoodItem;
  isOpen: boolean;
  onClose: () => void;
}

const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, isOpen, onClose }) => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [quantity, setQuantity] = useState<number>(1);
  
  const { useLogMeal } = useNutrition();
  const { toast } = useToast();
  const { mutate: logMeal, isPending } = useLogMeal();
  
  // Pre-calculate scaled nutrition values to avoid recalculation in render
  const calculatedNutrition = {
    calories: (food.nutritionInfo.calories * quantity).toFixed(1),
    protein: (food.nutritionInfo.protein * quantity).toFixed(1),
    carbs: (food.nutritionInfo.carbs * quantity).toFixed(1),
    fat: (food.nutritionInfo.fat * quantity).toFixed(1),
    fiber: food.nutritionInfo.fiber ? (food.nutritionInfo.fiber * quantity).toFixed(1) : undefined,
    sugar: food.nutritionInfo.sugar ? (food.nutritionInfo.sugar * quantity).toFixed(1) : undefined,
  };
  
  const handleTrackNow = () => {
    // Clone the food item and scale the nutrition info based on quantity
    const scaledFood = {
      ...food,
      nutritionInfo: {
        ...food.nutritionInfo,
        calories: food.nutritionInfo.calories * quantity,
        protein: food.nutritionInfo.protein * quantity,
        carbs: food.nutritionInfo.carbs * quantity,
        fat: food.nutritionInfo.fat * quantity,
        fiber: food.nutritionInfo.fiber ? food.nutritionInfo.fiber * quantity : undefined,
        sugar: food.nutritionInfo.sugar ? food.nutritionInfo.sugar * quantity : undefined,
      }
    };
    
    const mealLog: Omit<MealLog, 'id'> = {
      userId: '0', // Will be replaced with the actual user ID in the service
      date: new Date(date).toISOString(),
      mealType,
      foods: [scaledFood],
      totalCalories: scaledFood.nutritionInfo.calories,
      totalProtein: scaledFood.nutritionInfo.protein,
      totalCarbs: scaledFood.nutritionInfo.carbs,
      totalFat: scaledFood.nutritionInfo.fat
    };
    
    logMeal(mealLog, {
      onSuccess: () => {
        toast({
          title: "Food tracked successfully",
          description: `Added ${food.name} to your ${mealType} on ${format(new Date(date), 'MMMM d, yyyy')}`,
        });
        onClose();
      }
    });
  };
  
  // Only render the dialog content when the dialog is open to improve performance
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Track {food.name}</DialogTitle>
          <DialogDescription>
            Add this food to your meal log with your preferred quantity and meal type.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal-type" className="text-right">
              Meal
            </Label>
            <div className="col-span-3">
              <Select value={mealType} onValueChange={(value) => setMealType(value as any)}>
                <SelectTrigger id="meal-type">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0.25"
              step="0.25"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md mt-1">
            <div className="text-sm font-medium mb-2">Nutrition (adjusted for quantity)</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Calories: {calculatedNutrition.calories}</div>
              <div>Protein: {calculatedNutrition.protein}g</div>
              <div>Carbs: {calculatedNutrition.carbs}g</div>
              <div>Fat: {calculatedNutrition.fat}g</div>
              {calculatedNutrition.fiber && (
                <div>Fiber: {calculatedNutrition.fiber}g</div>
              )}
              {calculatedNutrition.sugar && (
                <div>Sugar: {calculatedNutrition.sugar}g</div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleTrackNow} disabled={isPending} type="button">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracking...
              </>
            ) : (
              'Track Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FoodDetailModal;
