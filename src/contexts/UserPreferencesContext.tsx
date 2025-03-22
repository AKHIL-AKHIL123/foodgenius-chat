import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, defaultUserPreferences } from '@/utils/sampleData';
import { saveUserPreferences, getUserPreferences } from '@/services/nutritionService';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserPreferencesContextProps {
  userPreferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateDietaryRestrictions: (dietaryRestrictions: string[]) => void;
  updateHealthGoals: (healthGoals: string[]) => void;
  updateAllergies: (allergies: string[]) => void;
  updateCalorieGoal: (calories: number) => void;
  updateMacroTargets: (macros: Partial<UserPreferences['macroTargets']>) => void;
  resetPreferences: () => void;
  loading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextProps | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserPreferences);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  // Load preferences from Supabase when user is authenticated
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        setLoading(true);
        try {
          const { success, data, error } = await getUserPreferences(user.id);
          
          if (success && data) {
            setUserPreferences(data);
          } else {
            // If we can't get user preferences, initialize with defaults and create them
            await saveUserPreferences(user.id, defaultUserPreferences);
            console.log('Created default preferences for user');
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
          // Don't show toast error here, as it's noisy on first login
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to localStorage when not authenticated
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          try {
            setUserPreferences(JSON.parse(savedPreferences));
          } catch (error) {
            console.error('Error parsing saved preferences:', error);
          }
        }
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences to Supabase or localStorage
  const savePreferences = async (preferences: UserPreferences) => {
    if (user) {
      const { success, error } = await saveUserPreferences(user.id, preferences);
      
      if (!success) {
        toast({
          title: "Error saving preferences",
          description: "Could not save your nutrition preferences.",
          variant: "destructive"
        });
        console.error('Error saving preferences:', error);
      }
    } else {
      // Fallback to localStorage when not authenticated
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    const newPreferences = { ...userPreferences, ...preferences };
    setUserPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateDietaryRestrictions = (dietaryRestrictions: string[]) => {
    const newPreferences = { ...userPreferences, dietaryRestrictions };
    setUserPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateHealthGoals = (healthGoals: string[]) => {
    const newPreferences = { ...userPreferences, healthGoals };
    setUserPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateAllergies = (allergies: string[]) => {
    const newPreferences = { ...userPreferences, allergies };
    setUserPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateCalorieGoal = (dailyCalorieGoal: number) => {
    const newPreferences = { ...userPreferences, dailyCalorieGoal };
    setUserPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateMacroTargets = (macros: Partial<UserPreferences['macroTargets']>) => {
    const newPreferences = {
      ...userPreferences,
      macroTargets: { ...userPreferences.macroTargets, ...macros }
    };
    setUserPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const resetPreferences = () => {
    setUserPreferences(defaultUserPreferences);
    savePreferences(defaultUserPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        userPreferences,
        updatePreferences,
        updateDietaryRestrictions,
        updateHealthGoals,
        updateAllergies,
        updateCalorieGoal,
        updateMacroTargets,
        resetPreferences,
        loading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
