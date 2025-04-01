
import { MacroNutrients } from './nutrition.d';

// Ensure we have default values when needed
export function ensureCompleteMacros(macros: Partial<MacroNutrients>): MacroNutrients {
  return {
    protein: macros.protein ?? 0,
    carbs: macros.carbs ?? 0,
    fat: macros.fat ?? 0
  };
}

// Re-export types from nutrition.d.ts to maintain backward compatibility
export * from './nutrition.d';
