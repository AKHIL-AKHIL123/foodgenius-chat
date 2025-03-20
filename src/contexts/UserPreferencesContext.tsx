
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, defaultUserPreferences } from '@/utils/sampleData';

interface UserPreferencesContextProps {
  userPreferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateDietaryRestrictions: (dietaryRestrictions: string[]) => void;
  updateHealthGoals: (healthGoals: string[]) => void;
  updateAllergies: (allergies: string[]) => void;
  updateCalorieGoal: (calories: number) => void;
  updateMacroTargets: (macros: Partial<UserPreferences['macroTargets']>) => void;
  resetPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextProps | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
  };

  const updateDietaryRestrictions = (dietaryRestrictions: string[]) => {
    setUserPreferences(prev => ({ ...prev, dietaryRestrictions }));
  };

  const updateHealthGoals = (healthGoals: string[]) => {
    setUserPreferences(prev => ({ ...prev, healthGoals }));
  };

  const updateAllergies = (allergies: string[]) => {
    setUserPreferences(prev => ({ ...prev, allergies }));
  };

  const updateCalorieGoal = (dailyCalorieGoal: number) => {
    setUserPreferences(prev => ({ ...prev, dailyCalorieGoal }));
  };

  const updateMacroTargets = (macros: Partial<UserPreferences['macroTargets']>) => {
    setUserPreferences(prev => ({
      ...prev,
      macroTargets: { ...prev.macroTargets, ...macros }
    }));
  };

  const resetPreferences = () => {
    setUserPreferences(defaultUserPreferences);
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
