
import React, { useState, useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Search, X } from 'lucide-react';
import { FoodItem } from '@/types/nutrition';
import { format } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useNutrition } from '@/hooks/useNutrition';
import { useToast } from '@/hooks/use-toast';

export const MealForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const { useSearchFood, useLogMeal } = useNutrition();
  const { toast } = useToast();
  
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { data: searchResults, isLoading: searchLoading } = useSearchFood(debouncedQuery, debouncedQuery.length >= 2);
  const { mutate: logMeal, isPending: isLogging } = useLogMeal();
  
  const handleAddFood = (food: FoodItem) => {
    setSelectedFoods(prev => [...prev, food]);
    setSearchQuery('');
    setDebouncedQuery('');
  };
  
  const handleRemoveFood = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };
  
  const calculateTotals = React.useMemo(() => {
    return selectedFoods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.nutritionInfo.calories,
        protein: acc.protein + food.nutritionInfo.protein,
        carbs: acc.carbs + food.nutritionInfo.carbs,
        fat: acc.fat + food.nutritionInfo.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [selectedFoods]);
  
  const handleLogMeal = () => {
    if (selectedFoods.length === 0) {
      toast({
        title: "No foods selected",
        description: "Please select at least one food item to log.",
        variant: "destructive"
      });
      return;
    }
    
    const mealLog = {
      userId: '0',  // Will be replaced with actual user ID in the service
      date: new Date(selectedDate).toISOString(),
      mealType,
      foods: selectedFoods,
      totalCalories: calculateTotals.calories,
      totalProtein: calculateTotals.protein,
      totalCarbs: calculateTotals.carbs,
      totalFat: calculateTotals.fat
    };
    
    logMeal(mealLog, {
      onSuccess: () => {
        setSelectedFoods([]);
        toast({
          title: "Meal logged successfully",
          description: `Added ${selectedFoods.length} food item(s) to your ${mealType}.`,
        });
      }
    });
  };

  return (
    <>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="meal-type" className="block text-sm font-medium mb-1">Meal Type</label>
              <Select value={mealType} onValueChange={(value) => setMealType(value as any)}>
                <SelectTrigger>
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
          
          <div>
            <label htmlFor="food-search" className="block text-sm font-medium mb-1">
              Search for food items
            </label>
            <div className="relative">
              <Input
                id="food-search"
                placeholder="Type to search for foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {searchLoading ? (
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                ) : (
                  <Search size={16} className="text-muted-foreground" />
                )}
              </div>
            </div>
            
            {searchQuery.length >= 2 && searchResults?.data && (
              <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                {searchResults.data.length > 0 ? (
                  <ul className="divide-y">
                    {searchResults.data.map((food) => (
                      <li key={food.id} className="p-2 hover:bg-muted flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {food.nutritionInfo.calories} cal | {food.nutritionInfo.servingSize}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddFood(food)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No foods found</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Selected Foods</h3>
            {selectedFoods.length > 0 ? (
              <div className="space-y-2">
                {selectedFoods.map((food, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-2 bg-muted rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium">{food.name}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{food.nutritionInfo.calories} cal</span>
                        <span>•</span>
                        <span>P: {food.nutritionInfo.protein}g</span>
                        <span>•</span>
                        <span>C: {food.nutritionInfo.carbs}g</span>
                        <span>•</span>
                        <span>F: {food.nutritionInfo.fat}g</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFood(index)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Total</h4>
                    <div className="text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <span>{Math.round(calculateTotals.calories)} calories</span>
                              <Info size={14} className="text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p>Protein: {Math.round(calculateTotals.protein)}g</p>
                              <p>Carbs: {Math.round(calculateTotals.carbs)}g</p>
                              <p>Fat: {Math.round(calculateTotals.fat)}g</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">
                  Search and add foods to your meal
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleLogMeal} 
          disabled={selectedFoods.length === 0 || isLogging}
          className="w-full"
        >
          {isLogging ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Logging Meal...
            </>
          ) : (
            'Log Meal'
          )}
        </Button>
      </CardFooter>
    </>
  );
};
