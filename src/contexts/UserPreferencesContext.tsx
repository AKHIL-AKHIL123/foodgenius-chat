
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserPreferences, defaultUserPreferences } from '@/utils/sampleData';
import { saveUserPreferences, getUserPreferences } from '@/services/userPreferencesService';
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
      setLoading(true);
      
      try {
        if (user) {
          const { success, data, error } = await getUserPreferences(user.id);
          
          if (success && data) {
            setUserPreferences(data);
          } else {
            // If we can't get user preferences, initialize with defaults and create them
            await saveUserPreferences(user.id, defaultUserPreferences);
            console.log('Created default preferences for user');
            setUserPreferences(defaultUserPreferences);
          }
        } else {
          // Fallback to localStorage when not authenticated
          const savedPreferences = localStorage.getItem('userPreferences');
          if (savedPreferences) {
            try {
              setUserPreferences(JSON.parse(savedPreferences));
            } catch (error) {
              console.error('Error parsing saved preferences:', error);
              setUserPreferences(defaultUserPreferences);
            }
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Ensure we always have default preferences even if there's an error
        setUserPreferences(defaultUserPreferences);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences to Supabase or localStorage
  const savePreferences = useCallback(async (preferences: UserPreferences) => {
    if (user) {
      try {
        const { success, error } = await saveUserPreferences(user.id, preferences);
        
        if (!success) {
          toast({
            title: "Error saving preferences",
            description: "Could not save your nutrition preferences.",
            variant: "destructive"
          });
          console.error('Error saving preferences:', error);
        }
      } catch (error) {
        console.error('Exception saving preferences:', error);
        toast({
          title: "Error saving preferences",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    } else {
      // Fallback to localStorage when not authenticated
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [user, toast]);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => {
      const newPreferences = { ...prev, ...preferences };
      savePreferences(newPreferences);
      return newPreferences;
    });
  }, [savePreferences]);

  const updateDietaryRestrictions = useCallback((dietaryRestrictions: string[]) => {
    setUserPreferences(prev => {
      const newPreferences = { ...prev, dietaryRestrictions };
      savePreferences(newPreferences);
      return newPreferences;
    });
  }, [savePreferences]);

  const updateHealthGoals = useCallback((healthGoals: string[]) => {
    setUserPreferences(prev => {
      const newPreferences = { ...prev, healthGoals };
      savePreferences(newPreferences);
      return newPreferences;
    });
  }, [savePreferences]);

  const updateAllergies = useCallback((allergies: string[]) => {
    setUserPreferences(prev => {
      const newPreferences = { ...prev, allergies };
      savePreferences(newPreferences);
      return newPreferences;
    });
  }, [savePreferences]);

  const updateCalorieGoal = useCallback((dailyCalorieGoal: number) => {
    setUserPreferences(prev => {
      const newPreferences = { ...prev, dailyCalorieGoal };
      savePreferences(newPreferences);
      return newPreferences;
    });
  }, [savePreferences]);

  const updateMacroTargets = useCallback((macros: Partial<UserPreferences['macroTargets']>) => {
    setUserPreferences(prev => {
      const newPreferences = {
        ...prev,
        macroTargets: { ...prev.macroTargets, ...macros }
      };
      savePreferences(newPreferences);
      return newPreferences;
    });
  }, [savePreferences]);

  const resetPreferences = useCallback(() => {
    setUserPreferences(defaultUserPreferences);
    savePreferences(defaultUserPreferences);
  }, [savePreferences]);

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
