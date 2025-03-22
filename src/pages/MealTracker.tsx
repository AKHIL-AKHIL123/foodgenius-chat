import React, { useState, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNutrition } from '@/hooks/useNutrition';
import { Loader2, Plus, Search, X, Info, AlertTriangle } from 'lucide-react';
import { FoodItem, MealLog } from '@/types/nutrition';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NutritionAnalysis = lazy(() => 
  import('@/components/NutritionAnalysis').then(module => ({
    default: module.default
  }))
);

const MealTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const { userPreferences, loading: preferencesLoading } = useUserPreferences();
  
  const { useSearchFood, useLogMeal, useMealLogs } = useNutrition();
  const { toast } = useToast();
  
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { data: searchResults, isLoading: searchLoading } = useSearchFood(debouncedQuery, debouncedQuery.length >= 2);
  const { mutate: logMeal, isPending: isLogging } = useLogMeal();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const { data: mealLogsData, isLoading: logsLoading, error: logsError } = useMealLogs(startDate.toISOString());
  
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
    
    const mealLog: Omit<MealLog, 'id'> = {
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
  
  const renderMealHistory = () => {
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
    
    const mealsByDate = mealLogsData.data.reduce((acc: Record<string, any[]>, meal: MealLog) => {
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
                  return mealOrder[a.mealType] - mealOrder[b.mealType];
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <Header />
      
      {preferencesLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log Your Meal</CardTitle>
                <CardDescription>Track your nutrition by logging what you eat</CardDescription>
              </CardHeader>
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
            </Card>
            
            <Suspense fallback={
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[350px] w-full" />
                </CardContent>
              </Card>
            }>
              <NutritionAnalysis days={7} />
            </Suspense>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Meal History</CardTitle>
                <CardDescription>Your logged meals from the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[800px] overflow-y-auto">
                {renderMealHistory()}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealTracker;
