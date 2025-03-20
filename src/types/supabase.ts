
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: number
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          preferences: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      meal_logs: {
        Row: {
          id: number
          user_id: string
          meal_data: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          meal_data: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          meal_data?: Json
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: number
          user_id: string
          plan_name: string
          plan_data: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          plan_name: string
          plan_data: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          plan_name?: string
          plan_data?: Json
          created_at?: string
        }
      }
      nutrition_data: {
        Row: {
          id: number
          food_name: string
          nutrition_info: Json
          created_at: string
        }
        Insert: {
          id?: number
          food_name: string
          nutrition_info: Json
          created_at?: string
        }
        Update: {
          id?: number
          food_name?: string
          nutrition_info?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
