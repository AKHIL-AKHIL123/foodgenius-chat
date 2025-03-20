
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

export interface FoodItem {
  id?: number;
  name: string;
  category: string;
  nutritionInfo: NutritionInfo;
  image?: string;
}

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
    snacks?: FoodItem[];
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
