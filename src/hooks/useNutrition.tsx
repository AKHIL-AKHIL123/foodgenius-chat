
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import * as nutritionService from '@/services/nutritionService';
import { FoodItem, MealLog, MealPlan } from '@/types/nutrition';

export const useNutrition = () => {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Food search query
  const useSearchFood = (query: string, enabled = true) => {
    return useQuery({
      queryKey: ['foodSearch', query],
      queryFn: () => nutritionService.searchFoodItems(query),
      enabled: query.length > 1 && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
  
  // Get food details
  const useFoodDetails = (foodId: number | undefined) => {
    return useQuery({
      queryKey: ['foodItem', foodId],
      queryFn: () => nutritionService.getFoodItemById(foodId as number),
      enabled: foodId !== undefined,
    });
  };
  
  // Add custom food item
  const useAddFoodItem = () => {
    return useMutation({
      mutationFn: (foodItem: Omit<FoodItem, 'id'>) => nutritionService.addFoodItem(foodItem),
      onSuccess: () => {
        toast({
          title: "Food item added",
          description: "Your custom food item has been saved.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error adding food item",
          description: error.message || "Failed to save food item",
          variant: "destructive",
        });
      },
    });
  };
  
  // User meal logs
  const useMealLogs = (startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ['mealLogs', user?.id, startDate, endDate],
      queryFn: () => nutritionService.getUserMealLogs(user?.id || '', startDate, endDate),
      enabled: !!user?.id,
    });
  };
  
  // Log a meal
  const useLogMeal = () => {
    return useMutation({
      mutationFn: (mealLog: Omit<MealLog, 'id'>) => 
        nutritionService.logMeal(user?.id || '', mealLog),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['mealLogs', user?.id] });
        toast({
          title: "Meal logged",
          description: "Your meal has been recorded successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error logging meal",
          description: error.message || "Failed to log meal",
          variant: "destructive",
        });
      },
    });
  };
  
  // User meal plans
  const useMealPlans = () => {
    return useQuery({
      queryKey: ['mealPlans', user?.id],
      queryFn: () => nutritionService.getUserMealPlans(user?.id || ''),
      enabled: !!user?.id,
    });
  };
  
  // Get specific meal plan
  const useMealPlan = (planId: number | undefined) => {
    return useQuery({
      queryKey: ['mealPlan', user?.id, planId],
      queryFn: () => nutritionService.getMealPlanById(user?.id || '', planId as number),
      enabled: !!user?.id && planId !== undefined,
    });
  };
  
  // Save meal plan
  const useSaveMealPlan = () => {
    return useMutation({
      mutationFn: (mealPlan: Omit<MealPlan, 'id'>) => 
        nutritionService.saveMealPlan(user?.id || '', mealPlan),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['mealPlans', user?.id] });
        toast({
          title: "Meal plan saved",
          description: "Your meal plan has been saved successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error saving meal plan",
          description: error.message || "Failed to save meal plan",
          variant: "destructive",
        });
      },
    });
  };
  
  // Nutrition analysis
  const useNutritionAnalysis = (days = 7) => {
    return useQuery({
      queryKey: ['nutritionAnalysis', user?.id, days],
      queryFn: () => nutritionService.analyzeUserNutrition(user?.id || '', days),
      enabled: !!user?.id,
    });
  };
  
  return {
    useSearchFood,
    useFoodDetails,
    useAddFoodItem,
    useMealLogs,
    useLogMeal,
    useMealPlans,
    useMealPlan,
    useSaveMealPlan,
    useNutritionAnalysis,
  };
};
