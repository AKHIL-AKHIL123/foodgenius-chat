
export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentDailyValue?: number;
  color?: string;
}

export interface FoodNutrition {
  id: string;
  name: string;
  emoji?: string;
  servingSize: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  nutrients: Nutrient[];
  benefits: string[];
  dietaryTags?: string[]; // vegetarian, vegan, gluten-free, etc.
  mealSuggestions?: string[]; // breakfast, lunch, dinner
  pairsWith?: string[]; // ids of foods that pair well
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  healthGoals: string[];
  allergies: string[];
  dailyCalorieGoal?: number;
  macroTargets?: {
    protein?: number; // percentage
    carbs?: number; // percentage
    fat?: number; // percentage
  };
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  foodData?: FoodNutrition;
  mealPlan?: MealPlan;
}

export interface MealPlan {
  id: string;
  name: string;
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: FoodNutrition[];
  }[];
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietaryTags: string[];
}

// Default user preferences
export const defaultUserPreferences: UserPreferences = {
  dietaryRestrictions: [],
  healthGoals: ['balanced-diet'],
  allergies: [],
  dailyCalorieGoal: 2000,
  macroTargets: {
    protein: 20, // 20% of calories
    carbs: 50, // 50% of calories
    fat: 30, // 30% of calories
  }
};

// Sample nutrition data for common foods
export const sampleFoods: Record<string, FoodNutrition> = {
  banana: {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    servingSize: '1 medium (118g)',
    calories: 105,
    macros: {
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14.4,
    },
    nutrients: [
      { name: 'Potassium', amount: 422, unit: 'mg', percentDailyValue: 9, color: '#2196F3' },
      { name: 'Vitamin B6', amount: 0.4, unit: 'mg', percentDailyValue: 25, color: '#4CAF50' },
      { name: 'Vitamin C', amount: 10.3, unit: 'mg', percentDailyValue: 11, color: '#4CAF50' },
      { name: 'Magnesium', amount: 31.9, unit: 'mg', percentDailyValue: 8, color: '#2196F3' },
    ],
    benefits: [
      'Good source of potassium which helps maintain healthy blood pressure',
      'Contains vitamin B6 that supports immune function',
      'Provides quick energy from natural sugars',
      'The fiber content supports digestive health'
    ],
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    mealSuggestions: ['breakfast', 'snack'],
    pairsWith: ['apple', 'broccoli']
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    emoji: '🍎',
    servingSize: '1 medium (182g)',
    calories: 95,
    macros: {
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
    },
    nutrients: [
      { name: 'Vitamin C', amount: 8.4, unit: 'mg', percentDailyValue: 9, color: '#4CAF50' },
      { name: 'Potassium', amount: 195, unit: 'mg', percentDailyValue: 4, color: '#2196F3' },
      { name: 'Vitamin K', amount: 4, unit: 'mcg', percentDailyValue: 3, color: '#4CAF50' },
    ],
    benefits: [
      'Rich in antioxidants like quercetin that have anti-inflammatory effects',
      'The soluble fiber pectin may help lower cholesterol levels',
      'Contains polyphenols that may help reduce blood pressure',
      'The fiber content promotes fullness and supports digestive health'
    ],
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    mealSuggestions: ['breakfast', 'snack'],
    pairsWith: ['banana']
  },
  chicken: {
    id: 'chicken',
    name: 'Chicken Breast',
    emoji: '🍗',
    servingSize: '3.5 oz (100g), cooked',
    calories: 165,
    macros: {
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    nutrients: [
      { name: 'Vitamin B6', amount: 0.6, unit: 'mg', percentDailyValue: 35, color: '#4CAF50' },
      { name: 'Niacin', amount: 13.4, unit: 'mg', percentDailyValue: 84, color: '#4CAF50' },
      { name: 'Phosphorus', amount: 196, unit: 'mg', percentDailyValue: 20, color: '#2196F3' },
      { name: 'Selenium', amount: 27.6, unit: 'mcg', percentDailyValue: 50, color: '#2196F3' },
    ],
    benefits: [
      'Excellent source of high-quality protein for muscle maintenance',
      'Contains B vitamins that help energy metabolism',
      'Low in carbohydrates, making it suitable for low-carb diets',
      'Rich in selenium which supports immune function'
    ],
    dietaryTags: ['high-protein', 'low-carb', 'gluten-free'],
    mealSuggestions: ['lunch', 'dinner'],
    pairsWith: ['broccoli']
  },
  broccoli: {
    id: 'broccoli',
    name: 'Broccoli',
    emoji: '🥦',
    servingSize: '1 cup (91g), chopped',
    calories: 31,
    macros: {
      protein: 2.5,
      carbs: 6,
      fat: 0.3,
      fiber: 2.4,
      sugar: 1.5,
    },
    nutrients: [
      { name: 'Vitamin C', amount: 81.2, unit: 'mg', percentDailyValue: 90, color: '#4CAF50' },
      { name: 'Vitamin K', amount: 116, unit: 'mcg', percentDailyValue: 97, color: '#4CAF50' },
      { name: 'Folate', amount: 57.3, unit: 'mcg', percentDailyValue: 14, color: '#4CAF50' },
      { name: 'Potassium', amount: 288, unit: 'mg', percentDailyValue: 6, color: '#2196F3' },
    ],
    benefits: [
      'Very high in vitamin C which supports immune function',
      'Contains sulforaphane, a compound with potential cancer-fighting properties',
      'Rich in antioxidants that help reduce inflammation',
      'High fiber content supports digestive health'
    ],
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'low-calorie'],
    mealSuggestions: ['lunch', 'dinner'],
    pairsWith: ['chicken', 'salmon']
  },
  salmon: {
    id: 'salmon',
    name: 'Salmon',
    emoji: '🐟',
    servingSize: '3.5 oz (100g), cooked',
    calories: 206,
    macros: {
      protein: 22,
      carbs: 0,
      fat: 13,
    },
    nutrients: [
      { name: 'Vitamin B12', amount: 2.38, unit: 'mcg', percentDailyValue: 40, color: '#4CAF50' },
      { name: 'Vitamin D', amount: 13.1, unit: 'mcg', percentDailyValue: 65, color: '#4CAF50' },
      { name: 'Selenium', amount: 31.3, unit: 'mcg', percentDailyValue: 57, color: '#2196F3' },
      { name: 'Omega-3 Fatty Acids', amount: 2.3, unit: 'g', percentDailyValue: 100, color: '#FF5722' },
    ],
    benefits: [
      'Excellent source of omega-3 fatty acids which support heart health',
      'High-quality protein for muscle maintenance and repair',
      'Contains vitamin D which is important for bone health',
      'Rich in B vitamins that support energy metabolism'
    ],
    dietaryTags: ['high-protein', 'keto', 'paleo', 'gluten-free'],
    mealSuggestions: ['lunch', 'dinner'],
    pairsWith: ['broccoli']
  }
};

// Sample meal plans
export const sampleMealPlans: Record<string, MealPlan> = {
  balanced: {
    id: 'balanced',
    name: 'Balanced Day Plan',
    meals: [
      {
        type: 'breakfast',
        foods: [sampleFoods.banana, sampleFoods.apple],
      },
      {
        type: 'lunch',
        foods: [sampleFoods.chicken, sampleFoods.broccoli],
      },
      {
        type: 'dinner',
        foods: [sampleFoods.salmon, sampleFoods.broccoli],
      }
    ],
    totalCalories: 633, // Sum of all included foods
    totalMacros: {
      protein: 57.3,
      carbs: 58,
      fat: 17.6,
    },
    dietaryTags: ['gluten-free']
  },
  lowCarb: {
    id: 'lowCarb',
    name: 'Low Carb Day Plan',
    meals: [
      {
        type: 'breakfast',
        foods: [sampleFoods.apple],
      },
      {
        type: 'lunch',
        foods: [sampleFoods.chicken, sampleFoods.broccoli],
      },
      {
        type: 'dinner',
        foods: [sampleFoods.salmon, sampleFoods.broccoli],
      }
    ],
    totalCalories: 528, // Sum of all included foods
    totalMacros: {
      protein: 56,
      carbs: 31,
      fat: 17.2,
    },
    dietaryTags: ['low-carb', 'gluten-free']
  },
  vegetarian: {
    id: 'vegetarian',
    name: 'Vegetarian Day Plan',
    meals: [
      {
        type: 'breakfast',
        foods: [sampleFoods.banana, sampleFoods.apple],
      },
      {
        type: 'lunch',
        foods: [sampleFoods.broccoli],
      },
      {
        type: 'dinner',
        foods: [sampleFoods.broccoli],
      }
    ],
    totalCalories: 157, // Sum of all included foods (note: this is very low for a day, in a real app would need more vegetarian options)
    totalMacros: {
      protein: 4.3,
      carbs: 33,
      fat: 1,
    },
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free']
  }
};

export const welcomeMessage: Message = {
  id: 'welcome',
  sender: 'bot',
  text: "Hi there! I'm NutriGuide, your nutrition assistant. Ask me about any food item and I'll provide nutritional information and meal suggestions. For example, try asking 'What nutrients are in a banana?' or 'Tell me about salmon nutrition.'",
  timestamp: new Date(),
}

// Available dietary preferences
export const dietaryOptions = [
  { id: 'balanced-diet', label: 'Balanced Diet' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'low-carb', label: 'Low-Carb' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'high-protein', label: 'High-Protein' },
];

// Available health goals
export const healthGoalOptions = [
  { id: 'weight-loss', label: 'Weight Loss' },
  { id: 'muscle-gain', label: 'Muscle Gain' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'balanced-diet', label: 'Balanced Diet' },
  { id: 'heart-health', label: 'Heart Health' },
  { id: 'improved-energy', label: 'Improved Energy' },
  { id: 'better-sleep', label: 'Better Sleep' },
  { id: 'digestive-health', label: 'Digestive Health' },
];

// Available allergens
export const allergenOptions = [
  { id: 'dairy', label: 'Dairy' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'tree-nuts', label: 'Tree Nuts' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'soy', label: 'Soy' },
];

