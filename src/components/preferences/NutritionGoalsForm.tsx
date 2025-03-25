
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/hooks/use-toast';
import { Slider } from "@/components/ui/slider";
import { Loader2, Target, BarChart3 } from 'lucide-react';

const NutritionGoalsForm: React.FC = () => {
  const { userPreferences, updateCalorieGoal, updateMacroTargets } = useUserPreferences();
  const [calorieInput, setCalorieInput] = useState(userPreferences.dailyCalorieGoal?.toString() || '2000');
  const [proteinPercent, setProteinPercent] = useState(userPreferences.macroTargets?.protein || 25);
  const [carbsPercent, setCarbsPercent] = useState(userPreferences.macroTargets?.carbs || 50);
  const [fatPercent, setFatPercent] = useState(userPreferences.macroTargets?.fat || 25);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleCalorieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalorieInput(e.target.value);
  };

  const handleProteinChange = (value: number[]) => {
    const newProtein = value[0];
    setProteinPercent(newProtein);
    // Adjust other macros to maintain 100% total
    const remainingPercent = 100 - newProtein;
    const ratio = carbsPercent / (carbsPercent + fatPercent) || 0.5;
    setCarbsPercent(Math.round(remainingPercent * ratio));
    setFatPercent(Math.round(remainingPercent * (1 - ratio)));
  };

  const handleCarbsChange = (value: number[]) => {
    const newCarbs = value[0];
    setCarbsPercent(newCarbs);
    // Adjust other macros to maintain 100% total
    const remainingPercent = 100 - newCarbs;
    const ratio = proteinPercent / (proteinPercent + fatPercent) || 0.5;
    setProteinPercent(Math.round(remainingPercent * ratio));
    setFatPercent(Math.round(remainingPercent * (1 - ratio)));
  };

  const handleFatChange = (value: number[]) => {
    const newFat = value[0];
    setFatPercent(newFat);
    // Adjust other macros to maintain 100% total
    const remainingPercent = 100 - newFat;
    const ratio = proteinPercent / (proteinPercent + carbsPercent) || 0.5;
    setProteinPercent(Math.round(remainingPercent * ratio));
    setCarbsPercent(Math.round(remainingPercent * (1 - ratio)));
  };

  const saveNutritionGoals = async () => {
    setIsSaving(true);
    
    try {
      const calories = parseInt(calorieInput);
      if (!isNaN(calories) && calories > 0) {
        await updateCalorieGoal(calories);
      }
      
      // Ensure macros add up to approximately 100%
      let protein = proteinPercent;
      let carbs = carbsPercent;
      let fat = fatPercent;
      
      const total = protein + carbs + fat;
      if (total < 95 || total > 105) {
        // Normalize to 100%
        const scaleFactor = 100 / total;
        protein = Math.round(protein * scaleFactor);
        carbs = Math.round(carbs * scaleFactor);
        fat = 100 - protein - carbs; // Ensure exact 100%
      }
      
      await updateMacroTargets({ protein, carbs, fat });
      
      toast({
        title: "Nutrition goals saved",
        description: "Your nutrition goals have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving nutrition goals:", error);
      toast({
        title: "Error saving goals",
        description: "There was a problem saving your nutrition goals.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Nutrition Goals
        </CardTitle>
        <CardDescription>
          Set your daily calorie target and macronutrient distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="calories" className="text-sm font-medium mb-2 block">
              Daily Calorie Goal
            </label>
            <div className="flex items-center gap-3">
              <Input
                id="calories"
                type="number"
                min="500"
                max="10000"
                className="max-w-[180px]"
                value={calorieInput}
                onChange={handleCalorieChange}
              />
              <span className="text-sm text-muted-foreground">calories per day</span>
            </div>
          </div>
          
          <div className="pt-4 space-y-6">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-primary" />
                Macronutrient Distribution
              </h4>
              <span className="text-sm text-muted-foreground">
                Total: {proteinPercent + carbsPercent + fatPercent}%
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="protein" className="text-sm">Protein</label>
                  <span className="text-sm font-medium">{proteinPercent}%</span>
                </div>
                <Slider
                  id="protein"
                  min={10}
                  max={60}
                  step={1}
                  value={[proteinPercent]}
                  onValueChange={handleProteinChange}
                  className="[&_[role=slider]]:bg-green-500"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((proteinPercent / 100) * parseInt(calorieInput || '2000') / 4)} g protein ({Math.round((proteinPercent / 100) * parseInt(calorieInput || '2000'))} cal)
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="carbs" className="text-sm">Carbohydrates</label>
                  <span className="text-sm font-medium">{carbsPercent}%</span>
                </div>
                <Slider
                  id="carbs"
                  min={10}
                  max={70}
                  step={1}
                  value={[carbsPercent]}
                  onValueChange={handleCarbsChange}
                  className="[&_[role=slider]]:bg-blue-500"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((carbsPercent / 100) * parseInt(calorieInput || '2000') / 4)} g carbs ({Math.round((carbsPercent / 100) * parseInt(calorieInput || '2000'))} cal)
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="fat" className="text-sm">Fat</label>
                  <span className="text-sm font-medium">{fatPercent}%</span>
                </div>
                <Slider
                  id="fat"
                  min={10}
                  max={50}
                  step={1}
                  value={[fatPercent]}
                  onValueChange={handleFatChange}
                  className="[&_[role=slider]]:bg-yellow-500"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((fatPercent / 100) * parseInt(calorieInput || '2000') / 9)} g fat ({Math.round((fatPercent / 100) * parseInt(calorieInput || '2000'))} cal)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={saveNutritionGoals} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Nutrition Goals"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NutritionGoalsForm;
