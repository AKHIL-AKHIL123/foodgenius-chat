
/**
 * NutriTracker API Endpoints Design
 * 
 * This document outlines the planned REST API endpoints for the NutriTracker application
 * with MongoDB integration and machine learning features.
 */

const apiEndpoints = {
  // Authentication Endpoints
  auth: {
    register: {
      method: 'POST',
      path: '/api/auth/register',
      description: 'Register a new user',
      body: {
        email: 'String',
        password: 'String',
        name: 'String'
      },
      response: {
        token: 'String',
        user: 'UserObject'
      }
    },
    login: {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate a user',
      body: {
        email: 'String',
        password: 'String'
      },
      response: {
        token: 'String',
        user: 'UserObject'
      }
    },
    refreshToken: {
      method: 'POST',
      path: '/api/auth/refresh',
      description: 'Refresh authentication token',
      body: {
        refreshToken: 'String'
      },
      response: {
        token: 'String'
      }
    }
  },
  
  // User Profile Endpoints
  userProfile: {
    get: {
      method: 'GET',
      path: '/api/users/profile',
      description: 'Get current user profile',
      response: 'UserProfileObject'
    },
    update: {
      method: 'PUT',
      path: '/api/users/profile',
      description: 'Update user profile',
      body: 'UserProfileUpdateObject',
      response: 'UserProfileObject'
    }
  },
  
  // Food Items Endpoints
  foodItems: {
    search: {
      method: 'GET',
      path: '/api/foods/search',
      description: 'Search food database',
      query: {
        q: 'String', // search query
        limit: 'Number', // results limit (default: 20)
        offset: 'Number', // pagination offset
        category: 'String' // optional category filter
      },
      response: {
        foods: ['FoodItemObject'],
        total: 'Number',
        limit: 'Number',
        offset: 'Number'
      }
    },
    getById: {
      method: 'GET',
      path: '/api/foods/:id',
      description: 'Get food item by ID',
      response: 'FoodItemObject'
    },
    create: {
      method: 'POST',
      path: '/api/foods',
      description: 'Create custom food item',
      body: 'FoodItemCreateObject',
      response: 'FoodItemObject'
    }
  },
  
  // Meal Logging Endpoints
  mealLogs: {
    create: {
      method: 'POST',
      path: '/api/meals',
      description: 'Log a new meal',
      body: 'MealLogCreateObject',
      response: 'MealLogObject'
    },
    getAll: {
      method: 'GET',
      path: '/api/meals',
      description: 'Get all meal logs for user',
      query: {
        startDate: 'Date',
        endDate: 'Date',
        limit: 'Number',
        offset: 'Number'
      },
      response: {
        meals: ['MealLogObject'],
        total: 'Number',
        limit: 'Number',
        offset: 'Number'
      }
    },
    getById: {
      method: 'GET',
      path: '/api/meals/:id',
      description: 'Get meal log by ID',
      response: 'MealLogObject'
    },
    update: {
      method: 'PUT',
      path: '/api/meals/:id',
      description: 'Update meal log',
      body: 'MealLogUpdateObject',
      response: 'MealLogObject'
    },
    delete: {
      method: 'DELETE',
      path: '/api/meals/:id',
      description: 'Delete meal log',
      response: {
        success: 'Boolean'
      }
    }
  },
  
  // Meal Plans Endpoints
  mealPlans: {
    create: {
      method: 'POST',
      path: '/api/meal-plans',
      description: 'Create a meal plan',
      body: 'MealPlanCreateObject',
      response: 'MealPlanObject'
    },
    getAll: {
      method: 'GET',
      path: '/api/meal-plans',
      description: 'Get all meal plans for user',
      response: {
        plans: ['MealPlanObject']
      }
    },
    getById: {
      method: 'GET',
      path: '/api/meal-plans/:id',
      description: 'Get meal plan by ID',
      response: 'MealPlanObject'
    },
    update: {
      method: 'PUT',
      path: '/api/meal-plans/:id',
      description: 'Update meal plan',
      body: 'MealPlanUpdateObject',
      response: 'MealPlanObject'
    },
    delete: {
      method: 'DELETE',
      path: '/api/meal-plans/:id',
      description: 'Delete meal plan',
      response: {
        success: 'Boolean'
      }
    }
  },
  
  // Nutrition Analysis Endpoints
  nutrition: {
    analyze: {
      method: 'GET',
      path: '/api/nutrition/analyze',
      description: 'Get nutrition analysis for specified time period',
      query: {
        days: 'Number', // analysis period in days
        startDate: 'Date', // optional specific start date
        endDate: 'Date' // optional specific end date
      },
      response: 'NutritionAnalysisObject'
    }
  },
  
  // Machine Learning Endpoints
  ml: {
    // Personalized Recommendations
    getRecommendations: {
      method: 'GET',
      path: '/api/ml/recommendations',
      description: 'Get personalized food and nutrition recommendations',
      query: {
        type: 'String', // 'meal', 'food', 'macro'
        mealType: 'String', // optional for meal-specific recs
        count: 'Number' // number of recommendations to return
      },
      response: {
        recommendations: ['RecommendationObject']
      }
    },
    
    // Nutrition Prediction
    predictNutrition: {
      method: 'POST',
      path: '/api/ml/predict/calories',
      description: 'Predict calories and nutrition from food description or image',
      body: {
        description: 'String', // text description of food
        imageUrl: 'String' // optional food image URL
      },
      response: {
        predictions: 'NutritionPredictionObject',
        confidence: 'Number'
      }
    },
    
    // Meal Pattern Analysis
    analyzeMealPatterns: {
      method: 'GET',
      path: '/api/ml/patterns',
      description: 'Analyze user meal patterns and habits',
      query: {
        days: 'Number' // analysis period
      },
      response: {
        patterns: ['PatternObject'],
        insights: ['InsightObject']
      }
    },
    
    // Goal Progress Prediction
    predictProgress: {
      method: 'GET',
      path: '/api/ml/predict/progress',
      description: 'Predict future progress based on current habits',
      query: {
        goalType: 'String', // e.g., 'weight', 'macros', 'calories'
        timeframe: 'Number' // prediction period in days
      },
      response: {
        currentStatus: 'StatusObject',
        prediction: 'PredictionObject',
        recommendations: ['RecommendationObject']
      }
    }
  }
};

module.exports = apiEndpoints;
