
// Extending existing file with more type definitions

// Define an interface with non-optional properties for macronutrients
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Ensure we have default values when needed
export function ensureCompleteMacros(macros: Partial<MacroNutrients>): MacroNutrients {
  return {
    protein: macros.protein ?? 0,
    carbs: macros.carbs ?? 0,
    fat: macros.fat ?? 0
  };
}
