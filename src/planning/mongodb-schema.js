
// MongoDB Schema Design for NutriTracker App

// User Profile Schema
const userProfileSchema = {
  _id: "ObjectId", // MongoDB automatically generated ID
  userId: "String", // Linked to auth system
  name: "String",
  email: "String",
  weight: "Number", // in kg
  height: "Number", // in cm
  age: "Number",
  gender: "String", // 'male', 'female', 'other'
  activityLevel: "String", // 'sedentary', 'light', 'moderate', 'active', 'very active'
  dailyCalorieGoal: "Number",
  macroTargets: {
    protein: "Number", // percentage
    carbs: "Number",   // percentage
    fat: "Number"      // percentage
  },
  preferences: {
    dietaryRestrictions: ["String"], // e.g., 'vegetarian', 'vegan', 'gluten-free'
    allergies: ["String"],
    excludedFoods: ["String"]
  },
  createdAt: "Date",
  updatedAt: "Date"
};

// Food Item Schema
const foodItemSchema = {
  _id: "ObjectId",
  name: "String",
  category: "String",
  nutritionInfo: {
    calories: "Number",
    protein: "Number", // in grams
    carbs: "Number",   // in grams
    fat: "Number",     // in grams
    fiber: "Number",   // in grams
    sugar: "Number",   // in grams
    vitamins: "Object",// key-value pairs of vitamins and amounts
    minerals: "Object",// key-value pairs of minerals and amounts
    servingSize: "String"
  },
  image: "String", // URL to image
  userId: "String", // If user-created custom food
  verified: "Boolean", // If verified by system
  createdAt: "Date",
  updatedAt: "Date"
};

// Meal Log Schema
const mealLogSchema = {
  _id: "ObjectId",
  userId: "String",
  date: "Date",
  mealType: "String", // 'breakfast', 'lunch', 'dinner', 'snack'
  foods: [
    {
      foodId: "ObjectId", // Reference to food item
      servingSize: "Number", // Multiplier of the standard serving
      customServingDescription: "String" // Optional description
    }
  ],
  totalCalories: "Number",
  totalProtein: "Number",
  totalCarbs: "Number",
  totalFat: "Number",
  notes: "String",
  tags: ["String"],
  createdAt: "Date",
  updatedAt: "Date"
};

// Meal Plan Schema
const mealPlanSchema = {
  _id: "ObjectId",
  userId: "String",
  name: "String",
  description: "String",
  days: [
    {
      dayNumber: "Number",
      meals: {
        breakfast: [{ foodId: "ObjectId", servingSize: "Number" }],
        lunch: [{ foodId: "ObjectId", servingSize: "Number" }],
        dinner: [{ foodId: "ObjectId", servingSize: "Number" }],
        snacks: [{ foodId: "ObjectId", servingSize: "Number" }]
      }
    }
  ],
  totalCalories: "Number",
  totalProtein: "Number",
  totalCarbs: "Number",
  totalFat: "Number",
  createdAt: "Date",
  updatedAt: "Date"
};

// User ML Insights Schema
const mlInsightsSchema = {
  _id: "ObjectId",
  userId: "String",
  type: "String", // 'nutritionPattern', 'recommendation', 'prediction'
  insights: "Object", // Flexible structure based on insight type
  confidence: "Number", // 0-1 score of confidence
  dateGenerated: "Date",
  expiresAt: "Date", // Optional expiration
  metadata: "Object", // Additional ML model information
  createdAt: "Date",
  updatedAt: "Date"
};

// Export schemas for reference
module.exports = {
  userProfileSchema,
  foodItemSchema,
  mealLogSchema,
  mealPlanSchema,
  mlInsightsSchema
};
