
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Common dietary options
const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'low-carb', label: 'Low Carb' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'nut-free', label: 'Nut Free' },
  { id: 'shellfish-free', label: 'Shellfish Free' },
  { id: 'egg-free', label: 'Egg Free' },
  { id: 'soy-free', label: 'Soy Free' }
];

const DietaryPreferencesForm: React.FC = () => {
  const { userPreferences, updateDietaryRestrictions, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your dietary preferences have been updated.",
    });
  };

  const handleDietaryChange = (id: string, checked: boolean) => {
    let newDietaryRestrictions = [...userPreferences.dietaryRestrictions];
    
    if (checked) {
      newDietaryRestrictions.push(id);
    } else {
      newDietaryRestrictions = newDietaryRestrictions.filter(item => item !== id);
    }
    
    updateDietaryRestrictions(newDietaryRestrictions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Preferences & Restrictions</CardTitle>
        <CardDescription>
          Select your dietary preferences to personalize meal recommendations and nutrition tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dietaryOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={option.id} 
                checked={userPreferences.dietaryRestrictions.includes(option.id)} 
                onCheckedChange={(checked) => handleDietaryChange(option.id, checked === true)}
              />
              <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </div>
        
        <div className="pt-4">
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DietaryPreferencesForm;
