
import { z } from "zod";

export const THEME_OPTIONS = ["light", "dark", "system"] as const;

export const THEME_SCHEMA = z.enum(THEME_OPTIONS);
export type Theme = z.infer<typeof THEME_SCHEMA>;

export function isValidTheme(theme: unknown): theme is Theme {
  try {
    THEME_SCHEMA.parse(theme);
    return true;
  } catch {
    return false;
  }
}
