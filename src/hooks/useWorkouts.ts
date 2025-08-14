import { useState, useEffect, useCallback } from 'react'
import { useToast } from './use-toast'
import WorkoutService from '@/integrations/supabase/workoutService'
import type { 
  Workout, 
  Exercise, 
  WorkoutSession, 
  ExerciseSet, 
  ScheduledWorkout,
  WorkoutWithExercises,
  WorkoutSessionWithDetails
} from '@/integrations/supabase/types'

export function useWorkouts() {
  const { toast } = useToast()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSessionWithDetails[]>([])
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load workout history when user changes
  useEffect(() => {
    // This will be called when the hook is used in components
    // The actual loading will happen when loadWorkoutHistory is called
  }, [])

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [workoutsData, exercisesData] = await Promise.all([
        WorkoutService.getWorkouts(),
        WorkoutService.getExercises()
      ])
      
      setWorkouts(workoutsData)
      setExercises(exercisesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workouts'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Workout Management
  const createWorkout = useCallback(async (workoutData: Omit<Workout, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newWorkout = await WorkoutService.createWorkout(workoutData)
      setWorkouts(prev => [...prev, newWorkout])
      toast({
        title: "Success",
        description: "Workout created successfully!"
      })
      return newWorkout
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workout'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  const updateWorkout = useCallback(async (workoutId: string, updates: Partial<Workout>) => {
    try {
      const updatedWorkout = await WorkoutService.updateWorkout(workoutId, updates)
      setWorkouts(prev => prev.map(w => w.id === workoutId ? updatedWorkout : w))
      toast({
        title: "Success",
        description: "Workout updated successfully!"
      })
      return updatedWorkout
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update workout'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  const deleteWorkout = useCallback(async (workoutId: string) => {
    try {
      await WorkoutService.deleteWorkout(workoutId)
      setWorkouts(prev => prev.filter(w => w.id !== workoutId))
      toast({
        title: "Success",
        description: "Workout deleted successfully!"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete workout'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  // Workout Sessions
  const startWorkoutSession = useCallback(async (workoutId: string, userId: string, sessionName?: string) => {
    try {
      const { session, exercises } = await WorkoutService.createCompleteWorkoutSession(userId, workoutId, sessionName)
      toast({
        title: "Workout Started",
        description: "Your workout session has begun!"
      })
      return { session, exercises }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start workout session'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  const completeWorkoutSession = useCallback(async (
    sessionId: string, 
    actualDuration: number, 
    notes?: string, 
    rating?: number
  ) => {
    try {
      const completedSession = await WorkoutService.finishWorkoutSession(sessionId, actualDuration, notes, rating)
      
      // Update local state
      setWorkoutHistory(prev => [completedSession as WorkoutSessionWithDetails, ...prev])
      
      toast({
        title: "Workout Complete",
        description: "Great job! Your workout has been saved."
      })
      
      return completedSession
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete workout session'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  const loadWorkoutHistory = useCallback(async (userId: string, limit = 10) => {
    try {
      const history = await WorkoutService.getRecentWorkoutHistory(userId, limit)
      setWorkoutHistory(history)
      return history
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workout history'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  // Exercise Sets
  const saveExerciseSets = useCallback(async (sets: Omit<ExerciseSet, 'id' | 'created_at'>[]) => {
    try {
      const savedSets = await WorkoutService.saveExerciseSets(sets)
      toast({
        title: "Success",
        description: "Exercise sets saved successfully!"
      })
      return savedSets
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save exercise sets'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  // Scheduled Workouts
  const scheduleWorkout = useCallback(async (scheduledWorkout: Omit<ScheduledWorkout, 'id' | 'created_at'>) => {
    try {
      const newScheduled = await WorkoutService.scheduleWorkout(scheduledWorkout)
      setScheduledWorkouts(prev => [...prev, newScheduled])
      toast({
        title: "Success",
        description: "Workout scheduled successfully!"
      })
      return newScheduled
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule workout'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  const loadScheduledWorkouts = useCallback(async (userId: string, startDate?: string, endDate?: string) => {
    try {
      const scheduled = await WorkoutService.getScheduledWorkouts(userId, startDate, endDate)
      setScheduledWorkouts(scheduled)
      return scheduled
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scheduled workouts'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  const deleteScheduledWorkout = useCallback(async (scheduledId: string) => {
    try {
      await WorkoutService.deleteScheduledWorkout(scheduledId)
      setScheduledWorkouts(prev => prev.filter(s => s.id !== scheduledId))
      toast({
        title: "Success",
        description: "Scheduled workout removed successfully!"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove scheduled workout'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  // Statistics
  const getWorkoutStats = useCallback(async (userId: string, startDate: string, endDate: string) => {
    try {
      return await WorkoutService.getWorkoutStats(userId, startDate, endDate)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workout statistics'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  // Get workout with exercises
  const getWorkoutWithExercises = useCallback(async (workoutId: string) => {
    try {
      return await WorkoutService.getWorkoutWithExercises(workoutId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workout details'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }, [toast])

  // Refresh data
  const refreshData = useCallback(() => {
    loadInitialData()
  }, [loadInitialData])

  return {
    // State
    workouts,
    exercises,
    workoutHistory,
    scheduledWorkouts,
    loading,
    error,
    
    // Actions
    createWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkoutSession,
    completeWorkoutSession,
    loadWorkoutHistory,
    saveExerciseSets,
    scheduleWorkout,
    loadScheduledWorkouts,
    deleteScheduledWorkout,
    getWorkoutStats,
    getWorkoutWithExercises,
    refreshData
  }
}

