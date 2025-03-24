
# NutriTracker Implementation Guide

This guide provides practical instructions for implementing the MongoDB, backend API, and ML features for NutriTracker.

## Getting Started

### 1. Setting Up MongoDB

First, we need to set up MongoDB to replace the current Supabase database:

```bash
# Install MongoDB driver and Mongoose
npm install mongodb mongoose

# Optional: Install MongoDB development tools
npm install -D mongodb-memory-server
```

### 2. Setting Up Express Backend

```bash
# Install Express and related packages
npm install express cors helmet jsonwebtoken bcrypt express-validator

# Install development dependencies
npm install -D nodemon
```

### 3. Initial Backend Structure

Create a `server` directory with the following structure:

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── ml/               # Machine learning models
└── server.js         # Entry point
```

## Implementation Steps

### Step 1: MongoDB Models

Create Mongoose models based on the schema designs:

```javascript
// Example: User Profile Model
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  weight: { type: Number },
  height: { type: Number },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  activityLevel: { type: String },
  dailyCalorieGoal: { type: Number, default: 2000 },
  macroTargets: {
    protein: { type: Number, default: 25 },
    carbs: { type: Number, default: 50 },
    fat: { type: Number, default: 25 }
  },
  preferences: {
    dietaryRestrictions: [String],
    allergies: [String],
    excludedFoods: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
```

### Step 2: API Endpoints

Implement the API routes and controllers:

```javascript
// Example: User Profile Routes
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

module.exports = router;
```

### Step 3: ML Integration

For the ML features, start with a simplified approach:

1. Begin with rule-based recommendations:
   - Implement basic algorithms for meal recommendations based on nutritional goals
   - Use statistical analysis for pattern detection

2. Integrate with pre-trained models:
   - Use TensorFlow.js with pre-trained models for food recognition
   - Implement API integration with existing nutrition databases

3. Plan for advanced ML features:
   - Design data collection processes for future model training
   - Create evaluation metrics to measure ML feature effectiveness

## Data Migration Strategy

To migrate from Supabase to MongoDB:

1. Extract data from Supabase:
   - Use Supabase API to fetch all user data, meal logs, food items
   - Export to JSON format for easier processing

2. Transform data to match MongoDB schema:
   - Map Supabase fields to MongoDB schema fields
   - Handle any data type conversions
   - Validate data integrity

3. Load data into MongoDB:
   - Use MongoDB's bulk insert operations for efficiency
   - Validate successful migration with data integrity checks
   - Maintain a rollback strategy during transition

## Testing Strategy

Implement a comprehensive testing strategy:

1. Unit tests for core functions and services
2. Integration tests for API endpoints
3. Performance tests for ML model inference
4. End-to-end tests for critical user flows

## Frontend Integration

Modify the frontend to work with the new backend:

1. Update API service to point to Express backend
2. Add authentication interceptors for JWT handling
3. Implement new ML features in the UI
4. Add data visualization for ML insights

## Deployment Considerations

For deployment, consider:

1. Containerization with Docker
2. CI/CD pipeline setup
3. Separate environments for development, staging, and production
4. Monitoring and logging infrastructure

## Next Steps

After reviewing this implementation guide:

1. Set up the development environment
2. Implement core MongoDB models and basic API
3. Start with rule-based ML features
4. Gradually introduce more advanced ML capabilities
