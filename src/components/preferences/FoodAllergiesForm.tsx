
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FoodAllergiesForm: React.FC = () => {
  const { userPreferences, updateAllergies } = useUserPreferences();
  const [newAllergy, setNewAllergy] = useState('');
  const { toast } = useToast();

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    
    const formattedAllergy = newAllergy.trim().toLowerCase();
    
    if (userPreferences.allergies.includes(formattedAllergy)) {
      toast({
        title: "Allergy already added",
        description: `${newAllergy} is already in your allergies list.`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedAllergies = [...userPreferences.allergies, formattedAllergy];
    updateAllergies(updatedAllergies);
    setNewAllergy('');
    
    toast({
      title: "Allergy added",
      description: `${newAllergy} has been added to your allergies list.`,
    });
  };

  const removeAllergy = (allergyToRemove: string) => {
    const updatedAllergies = userPreferences.allergies.filter(
      allergy => allergy !== allergyToRemove
    );
    updateAllergies(updatedAllergies);
    
    toast({
      title: "Allergy removed",
      description: `${allergyToRemove} has been removed from your allergies list.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Allergies</CardTitle>
        <CardDescription>
          Add any food allergies or ingredients you need to avoid
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add an allergy (e.g., peanuts)"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAllergy();
              }
            }}
          />
          <Button onClick={addAllergy}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {userPreferences.allergies.map((allergy) => (
            <Badge key={allergy} variant="secondary" className="flex items-center gap-1 py-1.5">
              {allergy}
              <button
                onClick={() => removeAllergy(allergy)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
          {userPreferences.allergies.length === 0 && (
            <p className="text-sm text-muted-foreground">No allergies added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodAllergiesForm;
