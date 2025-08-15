export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga'
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          estimated_duration: number
          created_by: string | null
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga'
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          estimated_duration: number
          created_by?: string | null
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga'
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
          estimated_duration?: number
          created_by?: string | null
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          target_muscles: string | null
          equipment_needed: string | null
          exercise_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          target_muscles?: string | null
          equipment_needed?: string | null
          exercise_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          target_muscles?: string | null
          equipment_needed?: string | null
          exercise_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          order_index: number
          default_sets: number
          default_reps: number
          default_duration: number | null
          rest_time: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          order_index: number
          default_sets?: number
          default_reps?: number
          default_duration?: number | null
          rest_time?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          order_index?: number
          default_sets?: number
          default_reps?: number
          default_duration?: number | null
          rest_time?: number
          notes?: string | null
          created_at?: string
        }
      }
      workout_sessions: {
        Row: {
          id: string
          workout_id: string | null
          user_id: string
          session_name: string | null
          started_at: string
          completed_at: string | null
          actual_duration: number | null
          notes: string | null
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id?: string | null
          user_id: string
          session_name?: string | null
          started_at: string
          completed_at?: string | null
          actual_duration?: number | null
          notes?: string | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string | null
          user_id?: string
          session_name?: string | null
          started_at?: string
          completed_at?: string | null
          actual_duration?: number | null
          notes?: string | null
          rating?: number | null
          created_at?: string
        }
      }
      exercise_sets: {
        Row: {
          id: string
          session_id: string
          exercise_id: string
          set_number: number
          reps: number | null
          weight: number | null
          duration: number | null
          distance: number | null
          rest_time: number | null
          completed: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          exercise_id: string
          set_number: number
          reps?: number | null
          weight?: number | null
          duration?: number | null
          distance?: number | null
          rest_time?: number | null
          completed?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          exercise_id?: string
          set_number?: number
          reps?: number | null
          weight?: number | null
          duration?: number | null
          distance?: number | null
          rest_time?: number | null
          completed?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      scheduled_workouts: {
        Row: {
          id: string
          workout_id: string
          user_id: string
          scheduled_date: string
          scheduled_time: string | null
          reminder_minutes: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          user_id: string
          scheduled_date: string
          scheduled_time?: string | null
          reminder_minutes?: number
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          user_id?: string
          scheduled_date?: string
          scheduled_time?: string | null
          reminder_minutes?: number
          completed?: boolean
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
      workout_type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga'
      difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[TableName] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DefaultSchema["Tables"] },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DefaultSchema["Tables"]
  }
    ? keyof DefaultSchema["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DefaultSchema["Tables"]
}
  ? DefaultSchema["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][TableName] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DefaultSchema["Tables"] },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DefaultSchema["Tables"]
  }
    ? keyof DefaultSchema["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DefaultSchema["Tables"]
}
  ? DefaultSchema["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][TableName] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DefaultSchema["Tables"] },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DefaultSchema["Tables"]
  }
    ? keyof DefaultSchema["Tables"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DefaultSchema["Tables"]
}
  ? DefaultSchema["Tables"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][EnumName]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DefaultSchema["Tables"] },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DefaultSchema["Tables"]
  }
    ? keyof DefaultSchema["CompositeTypes"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DefaultSchema["Tables"]
}
  ? DefaultSchema["CompositeTypes"][CompositeTypeName]
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["CompositeTypes"][CompositeTypeName]
    : never

export const Constants = {
  public: {
    Enums: {
      workout_type: ['Strength', 'Cardio', 'HIIT', 'Yoga'] as const,
      difficulty_level: ['Beginner', 'Intermediate', 'Advanced'] as const,
    },
  },
} as const

// Additional type definitions for the app
export type Workout = Database['public']['Tables']['workouts']['Row']
export type Exercise = Database['public']['Tables']['exercises']['Row']
export type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type ExerciseSet = Database['public']['Tables']['exercise_sets']['Row']
export type ScheduledWorkout = Database['public']['Tables']['scheduled_workouts']['Row']

// Extended types for the app
export type WorkoutWithExercises = Workout & {
  exercises: (Exercise & WorkoutExercise)[]
}

export type WorkoutSessionWithDetails = WorkoutSession & {
  workout?: Workout
  exercise_sets: (ExerciseSet & { exercise: Exercise })[]
}

export type ExerciseSetWithExercise = ExerciseSet & {
  exercise: Exercise
}

// Extended Exercise type for workout creation interface
export type ExerciseWithDefaults = Exercise & {
  default_sets?: number
  default_reps?: number
  default_weight?: number
}
