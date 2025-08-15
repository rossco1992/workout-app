import { supabase } from './client'
import type { 
  Workout, 
  Exercise, 
  WorkoutExercise, 
  WorkoutSession, 
  ExerciseSet, 
  ScheduledWorkout,
  WorkoutWithExercises,
  WorkoutSessionWithDetails
} from './types'

export class WorkoutService {
  // Workout Management
  static async getWorkouts(): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getTemplateWorkouts(): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('is_template', true)
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getWorkoutWithExercises(workoutId: string): Promise<WorkoutWithExercises | null> {
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single()
    
    if (workoutError) throw workoutError
    if (!workout) return null

    const { data: exercises, error: exercisesError } = await supabase
      .from('workout_exercises')
      .select(`
        *,
        exercises (*)
      `)
      .eq('workout_id', workoutId)
      .order('order_index')
    
    if (exercisesError) throw exercisesError

    return {
      ...workout,
      exercises: exercises?.map(we => ({
        ...we.exercises,
        ...we
      })) || []
    }
  }

  static async createWorkout(workout: Omit<Workout, 'id' | 'created_at' | 'updated_at'>): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', workoutId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteWorkout(workoutId: string): Promise<void> {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId)
    
    if (error) throw error
  }

  // Exercise Management
  static async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async createExercise(exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Workout Session Management
  static async startWorkoutSession(session: Omit<WorkoutSession, 'id' | 'created_at'>): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert(session)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async completeWorkoutSession(sessionId: string, updates: Partial<WorkoutSession>): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getWorkoutSessions(userId: string, limit = 50): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        workouts (*)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }

  static async getWorkoutSessionWithDetails(sessionId: string): Promise<WorkoutSessionWithDetails | null> {
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        workouts (*)
      `)
      .eq('id', sessionId)
      .single()
    
    if (sessionError) throw sessionError
    if (!session) return null

    const { data: exerciseSets, error: setsError } = await supabase
      .from('exercise_sets')
      .select(`
        *,
        exercises (*)
      `)
      .eq('session_id', sessionId)
      .order('set_number')
    
    if (setsError) throw setsError

    return {
      ...session,
      workout: session.workouts,
      exercise_sets: exerciseSets?.map(es => ({
        ...es,
        exercise: es.exercises
      })) || []
    }
  }

  // Exercise Sets Management
  static async saveExerciseSets(sets: Omit<ExerciseSet, 'id' | 'created_at'>[]): Promise<ExerciseSet[]> {
    const { data, error } = await supabase
      .from('exercise_sets')
      .insert(sets)
      .select()
    
    if (error) throw error
    return data || []
  }

  static async updateExerciseSet(setId: string, updates: Partial<ExerciseSet>): Promise<ExerciseSet> {
    const { data, error } = await supabase
      .from('exercise_sets')
      .update(updates)
      .eq('id', setId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Scheduled Workouts Management
  static async scheduleWorkout(scheduledWorkout: Omit<ScheduledWorkout, 'id' | 'created_at'>): Promise<ScheduledWorkout> {
    const { data, error } = await supabase
      .from('scheduled_workouts')
      .insert(scheduledWorkout)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getScheduledWorkouts(userId: string, startDate?: string, endDate?: string): Promise<ScheduledWorkout[]> {
    let query = supabase
      .from('scheduled_workouts')
      .select(`
        *,
        workouts (*)
      `)
      .eq('user_id', userId)
      .order('scheduled_date')
    
    if (startDate) {
      query = query.gte('scheduled_date', startDate)
    }
    
    if (endDate) {
      query = query.lte('scheduled_date', endDate)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async updateScheduledWorkout(scheduledId: string, updates: Partial<ScheduledWorkout>): Promise<ScheduledWorkout> {
    const { data, error } = await supabase
      .from('scheduled_workouts')
      .update(updates)
      .eq('id', scheduledId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteScheduledWorkout(scheduledId: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_workouts')
      .delete()
      .eq('id', scheduledId)
    
    if (error) throw error
  }

  // Analytics and Statistics
  static async getWorkoutStats(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('started_at', startDate)
      .lte('started_at', endDate)
      .order('started_at', { ascending: false })
    
    if (error) throw error
    
    const sessions = data || []
    const totalWorkouts = sessions.length
    const totalDuration = sessions.reduce((sum, session) => sum + (session.actual_duration || 0), 0)
    const completedWorkouts = sessions.filter(s => s.completed_at).length
    
    return {
      totalWorkouts,
      totalDuration,
      completedWorkouts,
      averageDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
      completionRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0
    }
  }

  static async getRecentWorkoutHistory(userId: string, limit = 10): Promise<WorkoutSessionWithDetails[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        workouts (*)
      `)
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    const sessions = data || []
    const sessionsWithDetails: WorkoutSessionWithDetails[] = []
    
    for (const session of sessions) {
      const details = await this.getWorkoutSessionWithDetails(session.id)
      if (details) {
        sessionsWithDetails.push(details)
      }
    }
    
    return sessionsWithDetails
  }

  // Helper method to create a complete workout session with exercises
  static async createCompleteWorkoutSession(
    userId: string,
    workoutId: string,
    sessionName?: string
  ): Promise<{ session: WorkoutSession; exercises: (Exercise & WorkoutExercise)[] }> {
    // Get workout with exercises
    const workoutWithExercises = await this.getWorkoutWithExercises(workoutId)
    if (!workoutWithExercises) {
      throw new Error('Workout not found')
    }

    // Create workout session
    const session = await this.startWorkoutSession({
      workout_id: workoutId,
      user_id: userId,
      session_name: sessionName || workoutWithExercises.name,
      started_at: new Date().toISOString(),
      completed_at: null,
      actual_duration: null,
      notes: null,
      rating: null
    })

    return {
      session,
      exercises: workoutWithExercises.exercises
    }
  }

  // Helper method to complete a workout session
  static async finishWorkoutSession(
    sessionId: string,
    actualDuration: number,
    notes?: string,
    rating?: number
  ): Promise<WorkoutSession> {
    return await this.completeWorkoutSession(sessionId, {
      completed_at: new Date().toISOString(),
      actual_duration: actualDuration,
      notes: notes || null,
      rating: rating || null
    })
  }
}

export default WorkoutService

