
// Type definitions for nutrition

// Define an interface with non-optional properties for macronutrients
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Declaration only - implementation will be in nutrition.ts
export function ensureCompleteMacros(macros: Partial<MacroNutrients>): MacroNutrients;

// Nutrition information interface
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  servingSize: string;
}

// Food item interface
export interface FoodItem {
  id?: number;
  name: string;
  category: string;
  nutritionInfo: NutritionInfo;
  image?: string;
}

// Meal log interface
export interface MealLog {
  id?: number;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Meal plan interface
export interface MealPlan {
  id?: number;
  userId: string;
  name: string;
  description?: string;
  meals: {
    day: number;
    breakfast?: FoodItem[];
    lunch?: FoodItem[];
    dinner?: FoodItem[];
    snack?: FoodItem[];
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
