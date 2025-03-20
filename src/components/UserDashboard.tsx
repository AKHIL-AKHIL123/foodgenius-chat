
import React, { useState } from 'react';
import { 
  dietaryOptions, 
  healthGoalOptions, 
  allergenOptions 
} from '@/utils/sampleData';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  X, 
  Heart, 
  Utensils, 
  AlertTriangle, 
  Target, 
  BarChart
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { 
    userPreferences, 
    updateDietaryRestrictions, 
    updateHealthGoals,
    updateAllergies,
    updateCalorieGoal,
    updateMacroTargets 
  } = useUserPreferences();
  
  const [calorieInput, setCalorieInput] = useState(userPreferences.dailyCalorieGoal?.toString() || '2000');
  const [proteinInput, setProteinInput] = useState(userPreferences.macroTargets?.protein?.toString() || '20');
  const [carbsInput, setCarbsInput] = useState(userPreferences.macroTargets?.carbs?.toString() || '50');
  const [fatInput, setFatInput] = useState(userPreferences.macroTargets?.fat?.toString() || '30');

  const toggleDietaryRestriction = (id: string) => {
    const current = [...userPreferences.dietaryRestrictions];
    if (current.includes(id)) {
      updateDietaryRestrictions(current.filter(item => item !== id));
    } else {
      updateDietaryRestrictions([...current, id]);
    }
  };

  const toggleHealthGoal = (id: string) => {
    const current = [...userPreferences.healthGoals];
    if (current.includes(id)) {
      updateHealthGoals(current.filter(item => item !== id));
    } else {
      updateHealthGoals([...current, id]);
    }
  };

  const toggleAllergy = (id: string) => {
    const current = [...userPreferences.allergies];
    if (current.includes(id)) {
      updateAllergies(current.filter(item => item !== id));
    } else {
      updateAllergies([...current, id]);
    }
  };

  const handleCalorieUpdate = () => {
    const calories = parseInt(calorieInput);
    if (!isNaN(calories) && calories > 0) {
      updateCalorieGoal(calories);
    }
  };

  const handleMacroUpdate = () => {
    const protein = parseInt(proteinInput);
    const carbs = parseInt(carbsInput);
    const fat = parseInt(fatInput);
    
    if (!isNaN(protein) && !isNaN(carbs) && !isNaN(fat)) {
      // Ensure they add up to roughly 100%
      const total = protein + carbs + fat;
      if (total >= 95 && total <= 105) {
        updateMacroTargets({
          protein,
          carbs,
          fat
        });
      } else {
        alert("Macronutrient percentages should add up to approximately 100%");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Settings size={18} />
          Nutritional Preferences
        </h2>
        <p className="text-sm text-muted-foreground">Customize your nutrition profile for personalized recommendations</p>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Dietary Restrictions */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Utensils size={16} className="text-primary" />
            Dietary Restrictions
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {dietaryOptions.map(option => (
              <Badge
                key={option.id}
                variant={userPreferences.dietaryRestrictions.includes(option.id) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => toggleDietaryRestriction(option.id)}
              >
                {option.label}
                {userPreferences.dietaryRestrictions.includes(option.id) && (
                  <X size={14} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Health Goals */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Heart size={16} className="text-primary" />
            Health Goals
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {healthGoalOptions.map(option => (
              <Badge
                key={option.id}
                variant={userPreferences.healthGoals.includes(option.id) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => toggleHealthGoal(option.id)}
              >
                {option.label}
                {userPreferences.healthGoals.includes(option.id) && (
                  <X size={14} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Allergies */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <AlertTriangle size={16} className="text-primary" />
            Allergies
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {allergenOptions.map(option => (
              <Badge
                key={option.id}
                variant={userPreferences.allergies.includes(option.id) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => toggleAllergy(option.id)}
              >
                {option.label}
                {userPreferences.allergies.includes(option.id) && (
                  <X size={14} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Calorie Goal */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Target size={16} className="text-primary" />
            Daily Calorie Goal
          </h3>
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              className="max-w-[120px]"
              value={calorieInput}
              onChange={(e) => setCalorieInput(e.target.value)}
            />
            <span className="text-sm text-muted-foreground">calories per day</span>
            <Button size="sm" variant="outline" onClick={handleCalorieUpdate}>
              Update
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Macro Targets */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <BarChart size={16} className="text-primary" />
            Macronutrient Targets
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Protein (%)</label>
              <Input 
                type="number" 
                min="0"
                max="100"
                value={proteinInput}
                onChange={(e) => setProteinInput(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Carbs (%)</label>
              <Input 
                type="number"
                min="0"
                max="100" 
                value={carbsInput}
                onChange={(e) => setCarbsInput(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Fat (%)</label>
              <Input 
                type="number" 
                min="0"
                max="100"
                value={fatInput}
                onChange={(e) => setFatInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={handleMacroUpdate}>
              Update Macros
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Note: Percentages should add up to approximately 100%
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
