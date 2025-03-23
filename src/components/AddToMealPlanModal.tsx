
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, CalendarIcon, Plus, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { FoodItem, MealPlan } from '@/types/nutrition';
import { useNutrition } from '@/hooks/useNutrition';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddToMealPlanModalProps {
  food: FoodItem;
  isOpen: boolean;
  onClose: () => void;
}

const AddToMealPlanModal: React.FC<AddToMealPlanModalProps> = ({ food, isOpen, onClose }) => {
  const [tab, setTab] = useState<string>('existing');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [newPlanName, setNewPlanName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  const { useMealPlans, useSaveMealPlan } = useNutrition();
  const { data: mealPlansData, isLoading: plansLoading } = useMealPlans();
  const { mutate: saveMealPlan, isPending } = useSaveMealPlan();
  const { toast } = useToast();
  
  // Create a default plan if no plans exist
  useEffect(() => {
    if (!plansLoading && (!mealPlansData?.data || mealPlansData.data.length === 0) && tab === 'existing') {
      // Auto-switch to the "New Plan" tab if no existing plans
      setTab('new');
    }
  }, [mealPlansData, plansLoading, tab]);
  
  const handleAddToMealPlan = () => {
    if (tab === 'new' && !newPlanName.trim()) {
      toast({
        title: "Plan name required",
        description: "Please enter a name for your new meal plan",
        variant: "destructive"
      });
      return;
    }
    
    if (tab === 'existing' && !selectedPlan) {
      toast({
        title: "Select a plan",
        description: "Please select a meal plan to add this food to",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date for this meal",
        variant: "destructive"
      });
      return;
    }
    
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
    
    if (tab === 'new') {
      // Create a new meal plan
      const newPlan: Omit<MealPlan, 'id'> = {
        userId: '0', // Will be replaced with the actual user ID in the service
        name: newPlanName,
        description: `Created on ${format(new Date(), 'MMMM d, yyyy')}`,
        meals: [
          {
            day: 1,
            [mealType]: [scaledFood],
          }
        ],
        totalCalories: scaledFood.nutritionInfo.calories,
        totalProtein: scaledFood.nutritionInfo.protein,
        totalCarbs: scaledFood.nutritionInfo.carbs,
        totalFat: scaledFood.nutritionInfo.fat
      };
      
      saveMealPlan(newPlan, {
        onSuccess: () => {
          toast({
            title: "Food added to new meal plan",
            description: `Added ${food.name} to ${mealType} in your new meal plan "${newPlanName}"`,
          });
          onClose();
        }
      });
    } else {
      // Add to existing meal plan
      const existingPlan = mealPlansData?.data.find(p => String(p.id) === selectedPlan);
      
      if (existingPlan) {
        const dayIndex = Math.floor((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const dayNumber = dayIndex > 0 ? dayIndex : 1;
        
        // Find if the day already exists in the meal plan
        let dayMeal = existingPlan.meals.find(m => m.day === dayNumber);
        
        if (!dayMeal) {
          // If the day doesn't exist, create it
          dayMeal = { day: dayNumber };
          existingPlan.meals.push(dayMeal);
        }
        
        // Add the food to the specified meal type
        if (!dayMeal[mealType]) {
          dayMeal[mealType] = [];
        }
        dayMeal[mealType]!.push(scaledFood);
        
        // Update the meal plan totals
        existingPlan.totalCalories += scaledFood.nutritionInfo.calories;
        existingPlan.totalProtein += scaledFood.nutritionInfo.protein;
        existingPlan.totalCarbs += scaledFood.nutritionInfo.carbs;
        existingPlan.totalFat += scaledFood.nutritionInfo.fat;
        
        saveMealPlan(existingPlan, {
          onSuccess: () => {
            toast({
              title: "Food added to meal plan",
              description: `Added ${food.name} to ${mealType} on day ${dayNumber} in "${existingPlan.name}"`,
            });
            onClose();
          }
        });
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {food.name} to Meal Plan</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="existing" value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Plan</TabsTrigger>
            <TabsTrigger value="new">New Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4 pt-4">
            <div className="space-y-4">
              {!plansLoading && (!mealPlansData?.data || mealPlansData.data.length === 0) ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You don't have any meal plans yet. Create a new plan first.
                  </AlertDescription>
                </Alert>
              ) : (
                <div>
                  <Label htmlFor="plan">Select a meal plan</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Choose a meal plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plansLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading meal plans...
                        </SelectItem>
                      ) : mealPlansData?.data && mealPlansData.data.length > 0 ? (
                        mealPlansData.data.map((plan) => (
                          <SelectItem key={plan.id} value={String(plan.id)}>
                            {plan.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No meal plans available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="plan-name">Plan name</Label>
              <Input
                id="plan-name"
                placeholder="Enter a name for your new meal plan"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Select day</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  initialFocus
                  fromDate={addDays(new Date(), -7)}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0.25"
              step="0.25"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md mt-2">
            <div className="text-sm font-medium mb-2">Nutrition (adjusted for quantity)</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Calories: {(food.nutritionInfo.calories * quantity).toFixed(1)}</div>
              <div>Protein: {(food.nutritionInfo.protein * quantity).toFixed(1)}g</div>
              <div>Carbs: {(food.nutritionInfo.carbs * quantity).toFixed(1)}g</div>
              <div>Fat: {(food.nutritionInfo.fat * quantity).toFixed(1)}g</div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddToMealPlan} disabled={isPending || (tab === 'existing' && (!mealPlansData?.data || mealPlansData.data.length === 0))}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> 
                Add to Plan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToMealPlanModal;
