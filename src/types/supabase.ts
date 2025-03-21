
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
          id: number;
          user_id: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        }
        Insert: {
          id?: number;
          user_id: string;
          preferences: Json;
          created_at?: string;
          updated_at?: string;
        }
        Update: {
          id?: number;
          user_id?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      meal_logs: {
        Row: {
          id: number;
          user_id: string;
          meal_data: Json;
          created_at: string;
        }
        Insert: {
          id?: number;
          user_id: string;
          meal_data: Json;
          created_at?: string;
        }
        Update: {
          id?: number;
          user_id?: string;
          meal_data?: Json;
          created_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      meal_plans: {
        Row: {
          id: number;
          user_id: string;
          plan_name: string;
          plan_data: Json;
          created_at: string;
        }
        Insert: {
          id?: number;
          user_id: string;
          plan_name: string;
          plan_data: Json;
          created_at?: string;
        }
        Update: {
          id?: number;
          user_id?: string;
          plan_name?: string;
          plan_data?: Json;
          created_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      nutrition_data: {
        Row: {
          id: number;
          food_name: string;
          nutrition_info: Json;
          created_at: string;
        }
        Insert: {
          id?: number;
          food_name: string;
          nutrition_info: Json;
          created_at?: string;
        }
        Update: {
          id?: number;
          food_name?: string;
          nutrition_info?: Json;
          created_at?: string;
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper type to allow our custom types to be stored as Json
export type JsonCompatible<T> = {
  [K in keyof T]: T[K] extends object
    ? JsonCompatible<T[K]>
    : T[K] extends Array<infer U>
    ? U extends object
      ? Array<JsonCompatible<U>>
      : T[K]
    : T[K];
};
