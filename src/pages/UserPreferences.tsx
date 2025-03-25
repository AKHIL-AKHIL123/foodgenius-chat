
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DietaryPreferencesForm from '@/components/preferences/DietaryPreferencesForm';
import FoodAllergiesForm from '@/components/preferences/FoodAllergiesForm';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

const UserPreferences: React.FC = () => {
  const { loading } = useUserPreferences();
  
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">User Preferences</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">User Preferences</h1>
      
      <Tabs defaultValue="dietary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="dietary">Dietary Preferences</TabsTrigger>
          <TabsTrigger value="allergies">Food Allergies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dietary" className="space-y-6">
          <DietaryPreferencesForm />
        </TabsContent>
        
        <TabsContent value="allergies" className="space-y-6">
          <FoodAllergiesForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPreferences;
