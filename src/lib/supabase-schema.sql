
-- Create tables for NutriGuide application

-- User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_preferences
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Meal Logs Table
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own meal logs" 
  ON public.meal_logs
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal logs" 
  ON public.meal_logs
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal logs" 
  ON public.meal_logs
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Meal Plans Table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name VARCHAR(255) NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own meal plans" 
  ON public.meal_plans
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans" 
  ON public.meal_plans
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" 
  ON public.meal_plans
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Nutrition Data Table (food database)
CREATE TABLE IF NOT EXISTS public.nutrition_data (
  id BIGSERIAL PRIMARY KEY,
  food_name VARCHAR(255) NOT NULL,
  nutrition_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(food_name)
);

-- Enable Row Level Security but allow all users to read
ALTER TABLE public.nutrition_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All users can view nutrition data" 
  ON public.nutrition_data
  FOR SELECT 
  USING (true);

-- Only admins can insert/update nutrition data
-- Note: You'll need to create an admin role or use a different mechanism for admin access
