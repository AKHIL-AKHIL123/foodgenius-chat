
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Utensils, BarChart, Calendar, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthRequiredMessage from '@/components/AuthRequiredMessage';

const Landing: React.FC = () => {
  const { user } = useSupabaseAuth();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Welcome to NutriGuide</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Your personal nutrition assistant for healthier eating habits and better food choices.
        </p>
      </header>

      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthRequiredMessage />
          
          <Card>
            <CardHeader>
              <CardTitle>Track Your Nutrition</CardTitle>
              <CardDescription>
                Log your meals and track your daily nutritional intake
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use our meal tracker to record what you eat and get detailed nutritional information,
                including calories, macros, and more.
              </p>
              
              <Link to="/meal-tracker">
                <Button className="w-full flex items-center justify-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Try Meal Tracker 
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Track Your Meals</CardTitle>
            <CardDescription>
              Log and analyze your daily food intake
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Record your meals and get instant nutritional insights. Track calories, macros, and more.
            </p>
            <Link to="/meal-tracker">
              <Button variant="outline" className="w-full">
                Go to Meal Tracker
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Set Your Preferences</CardTitle>
            <CardDescription>
              Customize your dietary preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set your dietary preferences, food allergies, and nutrition goals for personalized recommendations.
            </p>
            <Link to="/preferences">
              <Button variant="outline" className="w-full">
                Manage Preferences
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Get Insights</CardTitle>
            <CardDescription>
              Data-driven nutrition recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get personalized insights based on your eating habits and nutritional goals.
            </p>
            <Button variant="outline" className="w-full" disabled={!user}>
              View Recommendations
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Landing;
