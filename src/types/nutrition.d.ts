
// Type definitions for nutrition

// Define an interface with non-optional properties for macronutrients
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Declaration only - implementation will be in nutrition.ts
export function ensureCompleteMacros(macros: Partial<MacroNutrients>): MacroNutrients;
