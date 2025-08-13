import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  Plus, 
  Play, 
  TrendingUp,
  Target,
  Zap,
  Save,
  CheckCircle,
  Circle,
  Trash2,
  Edit,
  MoreVertical
} from "lucide-react";
import heroImage from "@/assets/hero-workout.jpg";

interface Workout {
  id: string;
  name: string;
  exercises: number;
  duration: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Strength" | "Cardio" | "HIIT" | "Yoga";
}

interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  target: string;
  sets: ExerciseSet[];
  defaultSets: number;
  defaultReps: number;
}

interface WorkoutHistory {
  id: string;
  date: string;
  workoutName: string;
  duration: number;
  exercises: Exercise[];
  completed: boolean;
}

const WorkoutDashboard = () => {
  const { toast } = useToast();
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [workoutData, setWorkoutData] = useState<Exercise[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [scheduledWorkouts, setScheduledWorkouts] = useState<{[key: string]: {workout: Workout, time: string}[]}>({});
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    type: "Strength" as "Strength" | "Cardio" | "HIIT" | "Yoga",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    duration: 30,
    exercises: [] as Exercise[]
  });
  
  useEffect(() => {
    // Load workout history
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory));
    }
    
    // Check for deleted predefined workouts
    const deletedWorkouts = localStorage.getItem('deletedWorkouts');
    const deletedIds = deletedWorkouts ? JSON.parse(deletedWorkouts) : [];
    
    // Filter out deleted predefined workouts
    if (deletedIds.length > 0) {
      setWorkouts(prev => prev.filter(w => !deletedIds.includes(w.id)));
    }
    
    // Load custom workouts and merge with predefined ones
    const savedWorkouts = localStorage.getItem('customWorkouts');
    if (savedWorkouts) {
      const customWorkouts = JSON.parse(savedWorkouts);
      setWorkouts(prev => {
        // Only add custom workouts that don't already exist
        const existingIds = prev.map(w => w.id);
        const newCustomWorkouts = customWorkouts.filter((cw: Workout) => !existingIds.includes(cw.id));
        return [...prev, ...newCustomWorkouts];
      });
    }

    // Load scheduled workouts
    const savedSchedule = localStorage.getItem('scheduledWorkouts');
    if (savedSchedule) {
      setScheduledWorkouts(JSON.parse(savedSchedule));
    }
  }, []);
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Upper Body Blast",
      exercises: 6,
      duration: 45,
      difficulty: "Intermediate",
      type: "Strength"
    },
    {
      id: "2", 
      name: "Morning Cardio",
      exercises: 4,
      duration: 30,
      difficulty: "Beginner",
      type: "Cardio"
    },
    {
      id: "3",
      name: "HIIT Circuit",
      exercises: 8,
      duration: 25,
      difficulty: "Advanced", 
      type: "HIIT"
    }
  ]);

  const createExerciseData = (workoutType: string, workoutName: string, workoutId?: string): Exercise[] => {
    // Check if this is a custom workout
    if (workoutId) {
      const customWorkoutExercises = localStorage.getItem('customWorkoutExercises');
      if (customWorkoutExercises) {
        const exercisesData = JSON.parse(customWorkoutExercises);
        if (exercisesData[workoutId]) {
          return exercisesData[workoutId].map((ex: Exercise) => ({
            ...ex,
            sets: [] // Reset sets for new workout session
          }));
        }
      }
    }
    if (workoutType === "Strength" && workoutName === "Upper Body Blast") {
      return [
        { id: "1", name: "Push-ups", target: "Chest, shoulders, triceps", sets: [], defaultSets: 3, defaultReps: 12 },
        { id: "2", name: "Dumbbell Rows", target: "Back, biceps", sets: [], defaultSets: 3, defaultReps: 10 },
        { id: "3", name: "Shoulder Press", target: "Shoulders, triceps", sets: [], defaultSets: 3, defaultReps: 8 },
        { id: "4", name: "Bicep Curls", target: "Biceps", sets: [], defaultSets: 3, defaultReps: 12 },
        { id: "5", name: "Tricep Dips", target: "Triceps", sets: [], defaultSets: 3, defaultReps: 10 },
        { id: "6", name: "Plank", target: "Core stability", sets: [], defaultSets: 3, defaultReps: 30 }
      ];
    }
    if (workoutType === "Cardio" && workoutName === "Morning Cardio") {
      return [
        { id: "1", name: "Warm-up Walk", target: "Cardio warm-up", sets: [], defaultSets: 1, defaultReps: 5 },
        { id: "2", name: "Jogging", target: "Cardio endurance", sets: [], defaultSets: 1, defaultReps: 15 },
        { id: "3", name: "Jumping Jacks", target: "High intensity", sets: [], defaultSets: 3, defaultReps: 30 },
        { id: "4", name: "Cool-down Walk", target: "Recovery", sets: [], defaultSets: 1, defaultReps: 5 }
      ];
    }
    if (workoutType === "HIIT" && workoutName === "HIIT Circuit") {
      return [
        { id: "1", name: "Burpees", target: "Full body explosive", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "2", name: "Mountain Climbers", target: "Core and cardio", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "3", name: "Jump Squats", target: "Lower body power", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "4", name: "High Knees", target: "Cardio and legs", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "5", name: "Push-up to T", target: "Upper body and core", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "6", name: "Plank Jacks", target: "Core and cardio", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "7", name: "Russian Twists", target: "Obliques and core", sets: [], defaultSets: 3, defaultReps: 45 },
        { id: "8", name: "Sprint in Place", target: "Maximum intensity", sets: [], defaultSets: 3, defaultReps: 45 }
      ];
    }
    return [];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success";
      case "Intermediate": return "bg-warning";
      case "Advanced": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Strength": return <Dumbbell className="h-4 w-4" />;
      case "Cardio": return <TrendingUp className="h-4 w-4" />;
      case "HIIT": return <Zap className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleStartWorkout = (workoutName: string) => {
    const selectedWorkout = workouts.find(w => w.name === workoutName);
    if (selectedWorkout) {
      const exerciseData = createExerciseData(selectedWorkout.type, selectedWorkout.name, selectedWorkout.id);
      setActiveWorkout(selectedWorkout);
      setWorkoutData(exerciseData);
      toast({
        title: "Starting Workout",
        description: `Let's begin your ${workoutName} workout!`,
      });
    }
  };

  const handleCreateWorkout = () => {
    setShowCreateWorkout(true);
  };
  
  const handleSaveNewWorkout = () => {
    if (!newWorkout.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name",
        variant: "destructive"
      });
      return;
    }
    
    if (newWorkout.exercises.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one exercise",
        variant: "destructive"
      });
      return;
    }
    
    const savedWorkouts = localStorage.getItem('customWorkouts');
    const customWorkouts = savedWorkouts ? JSON.parse(savedWorkouts) : [];
    
    const workoutToSave: Workout = {
      id: Date.now().toString(),
      name: newWorkout.name,
      exercises: newWorkout.exercises.length,
      duration: newWorkout.duration,
      difficulty: newWorkout.difficulty,
      type: newWorkout.type
    };
    
    customWorkouts.push(workoutToSave);
    localStorage.setItem('customWorkouts', JSON.stringify(customWorkouts));
    
    // Also store the exercises data for this custom workout
    const customWorkoutExercises = localStorage.getItem('customWorkoutExercises');
    const exercisesData = customWorkoutExercises ? JSON.parse(customWorkoutExercises) : {};
    exercisesData[workoutToSave.id] = newWorkout.exercises;
    localStorage.setItem('customWorkoutExercises', JSON.stringify(exercisesData));
    
    // Update the workouts list
    setWorkouts(prev => [...prev, workoutToSave]);
    
    setNewWorkout({
      name: "",
      type: "Strength",
      difficulty: "Beginner", 
      duration: 30,
      exercises: []
    });
    setShowCreateWorkout(false);
    
    toast({
      title: "Workout Created",
      description: `${newWorkout.name} has been saved to your workouts!`
    });
  };
  
  const handleAddExerciseToWorkout = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      target: "",
      sets: [],
      defaultSets: 3,
      defaultReps: 10
    };
    
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };
  
  const handleUpdateExerciseInWorkout = (exerciseId: string, updates: Partial<Exercise>) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      )
    }));
  };
  
  const handleRemoveExerciseFromWorkout = (exerciseId: string) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleDeleteWorkout = (workout: Workout) => {
    setWorkoutToDelete(workout);
  };

  const confirmDeleteWorkout = () => {
    if (!workoutToDelete) return;

    // Remove from workouts list
    setWorkouts(prev => prev.filter(w => w.id !== workoutToDelete.id));

    // Check if this is a predefined workout
    const predefinedIds = ["1", "2", "3"];
    const isPredefined = predefinedIds.includes(workoutToDelete.id);

    if (isPredefined) {
      // Track deleted predefined workouts
      const deletedWorkouts = localStorage.getItem('deletedWorkouts');
      const deletedIds = deletedWorkouts ? JSON.parse(deletedWorkouts) : [];
      deletedIds.push(workoutToDelete.id);
      localStorage.setItem('deletedWorkouts', JSON.stringify(deletedIds));
    } else {
      // Update localStorage for custom workouts
      const savedWorkouts = localStorage.getItem('customWorkouts');
      if (savedWorkouts) {
        const customWorkouts = JSON.parse(savedWorkouts);
        const updatedWorkouts = customWorkouts.filter((w: Workout) => w.id !== workoutToDelete.id);
        localStorage.setItem('customWorkouts', JSON.stringify(updatedWorkouts));
      }

      // Also remove exercise data for custom workouts
      const customWorkoutExercises = localStorage.getItem('customWorkoutExercises');
      if (customWorkoutExercises) {
        const exercisesData = JSON.parse(customWorkoutExercises);
        delete exercisesData[workoutToDelete.id];
        localStorage.setItem('customWorkoutExercises', JSON.stringify(exercisesData));
      }
    }

    toast({
      title: "Workout Deleted",
      description: `${workoutToDelete.name} has been removed.`
    });

    setWorkoutToDelete(null);
  };

  const handleImportPlan = () => {
    toast({
      title: "Import Plan",
      description: "Plan import feature coming soon!",
    });
  };

  const handleViewSchedule = () => {
    setShowScheduleDialog(true);
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const scheduleWorkout = (workout: Workout, date: Date, time: string) => {
    const dateKey = formatDateKey(date);
    const newScheduledWorkout = { workout, time };
    
    setScheduledWorkouts(prev => {
      const updated = { ...prev };
      if (!updated[dateKey]) {
        updated[dateKey] = [];
      }
      updated[dateKey].push(newScheduledWorkout);
      
      // Save to localStorage
      localStorage.setItem('scheduledWorkouts', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Workout Scheduled",
      description: `${workout.name} scheduled for ${date.toLocaleDateString()} at ${time}`,
    });
  };

  const removeScheduledWorkout = (date: Date, index: number) => {
    const dateKey = formatDateKey(date);
    
    setScheduledWorkouts(prev => {
      const updated = { ...prev };
      if (updated[dateKey]) {
        updated[dateKey].splice(index, 1);
        if (updated[dateKey].length === 0) {
          delete updated[dateKey];
        }
      }
      
      // Save to localStorage
      localStorage.setItem('scheduledWorkouts', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Workout Removed",
      description: "Scheduled workout has been removed.",
    });
  };

  const handleProgressReport = () => {
    toast({
      title: "Progress Report",
      description: "Progress tracking coming soon!",
    });
  };

  // Helper function to get start of current week (Monday)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff));
  };

  // Calculate this week's stats
  const calculateWeeklyStats = () => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    
    // Filter workouts from this week
    const thisWeekWorkouts = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek && workoutDate <= now;
    });

    // Calculate count
    const workoutCount = thisWeekWorkouts.length;

    // Calculate total time
    const totalMinutes = thisWeekWorkouts.reduce((total, workout) => total + workout.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalTimeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Calculate weekly goal percentage (target: 5 workouts per week)
    const weeklyTarget = 5;
    const goalPercentage = Math.min(Math.round((workoutCount / weeklyTarget) * 100), 100);

    return {
      workoutCount,
      totalTimeText,
      goalPercentage,
      totalMinutes
    };
  };

  const handleEndWorkout = () => {
    if (activeWorkout && workoutData.length > 0) {
      const workoutRecord: WorkoutHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        workoutName: activeWorkout.name,
        duration: activeWorkout.duration,
        exercises: workoutData,
        completed: true
      };
      
      const updatedHistory = [workoutRecord, ...workoutHistory];
      setWorkoutHistory(updatedHistory);
      localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
    }
    
    setActiveWorkout(null);
    setWorkoutData([]);
    setSelectedExercise(null);
    toast({
      title: "Workout Complete",
      description: "Great job! Your workout has been saved.",
    });
  };
  
  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };
  
  const handleSaveExerciseData = (exerciseId: string, sets: ExerciseSet[]) => {
    setWorkoutData(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, sets } : ex
    ));
    setSelectedExercise(null);
    toast({
      title: "Exercise Updated",
      description: "Your set data has been saved.",
    });
  };

  if (activeWorkout) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{activeWorkout.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                {getTypeIcon(activeWorkout.type)}
                <span>{activeWorkout.exercises} exercises</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{activeWorkout.duration} min</span>
                <Badge className={getDifficultyColor(activeWorkout.difficulty)}>
                  {activeWorkout.difficulty}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleEndWorkout}>
              End Workout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Workout Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workoutData.map((exercise, index) => {
                  const completedSets = exercise.sets.filter(set => set.completed).length;
                  const totalSets = Math.max(exercise.defaultSets, exercise.sets.length);
                  
                  return (
                    <div 
                      key={exercise.id} 
                      className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleExerciseClick(exercise)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{index + 1}. {exercise.name}</h3>
                        {completedSets === totalSets && totalSets > 0 && (
                          <CheckCircle className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {exercise.defaultSets} sets × {exercise.defaultReps} {activeWorkout?.type === 'HIIT' ? 'seconds' : 'reps'}
                      </p>
                      <p className="text-sm mb-2">Target: {exercise.target}</p>
                      {exercise.sets.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Progress: {completedSets}/{totalSets} sets completed
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Workout Timer</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="text-6xl font-bold text-primary">
                  {activeWorkout.duration}:00
                </div>
                <div className="space-y-4">
                  <Button size="lg" className="w-full">
                    <Play className="h-5 w-5 mr-2" />
                    Start Timer
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Take your time and focus on proper form
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Today's Goals</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Complete all exercises</li>
                    <li>✓ Maintain proper form</li>
                    <li>✓ Stay hydrated</li>
                    <li>✓ Have fun!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <CreateWorkoutDialog 
            open={showCreateWorkout}
            workout={newWorkout}
            onSave={handleSaveNewWorkout}
            onClose={() => setShowCreateWorkout(false)}
            onUpdateWorkout={setNewWorkout}
            onAddExercise={handleAddExerciseToWorkout}
            onUpdateExercise={handleUpdateExerciseInWorkout}
            onRemoveExercise={handleRemoveExerciseFromWorkout}
          />
          
          <ExerciseDialog 
            exercise={selectedExercise}
            onSave={handleSaveExerciseData}
            onClose={() => setSelectedExercise(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">FitTracker Pro</h1>
          <p className="text-xl opacity-90">Your personal workout companion</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(() => {
            const stats = calculateWeeklyStats();
            return (
              <>
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">This Week</p>
                        <p className="text-2xl font-bold">{stats.workoutCount} Workout{stats.workoutCount !== 1 ? 's' : ''}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Time</p>
                        <p className="text-2xl font-bold">{stats.totalTimeText}</p>
                      </div>
                      <Clock className="h-8 w-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Weekly Goal</p>
                        <p className="text-2xl font-bold">{stats.goalPercentage}%</p>
                      </div>
                      <Target className={`h-8 w-8 ${stats.goalPercentage >= 100 ? 'text-success' : stats.goalPercentage >= 60 ? 'text-warning' : 'text-muted-foreground'}`} />
                    </div>
                    <Progress value={stats.goalPercentage} className="mt-2" />
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button size="lg" className="h-20 shadow-button hover:shadow-glow transition-all duration-300" onClick={handleCreateWorkout}>
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto mb-1" />
                <span>Create Workout</span>
              </div>
            </Button>
            
            <Button variant="outline" size="lg" className="h-20" onClick={handleViewSchedule}>
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-1" />
                <span>View Schedule</span>
              </div>
            </Button>
            
            <Button variant="outline" size="lg" className="h-20" onClick={handleProgressReport}>
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                <span>Progress Report</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Workouts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Workouts</h2>
              <Button variant="outline" size="sm" onClick={handleImportPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Import Plan
              </Button>
            </div>
            
            <div className="space-y-4">
              {workouts.map((workout) => (
                <Card key={workout.id} className="shadow-card hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{workout.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getTypeIcon(workout.type)}
                          <span>{workout.exercises} exercises</span>
                          <span>•</span>
                          <Clock className="h-4 w-4" />
                          <span>{workout.duration} min</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(workout.difficulty)}>
                          {workout.difficulty}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleDeleteWorkout(workout)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Workout
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full shadow-button hover:shadow-glow transition-all duration-300"
                      onClick={() => handleStartWorkout(workout.name)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {workoutHistory.slice(0, 3).map((workout) => (
                <Card key={workout.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{workout.workoutName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString()} • {workout.duration} min
                        </p>
                      </div>
                      <Badge variant="outline">{workout.exercises.length} exercises</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {workoutHistory.length === 0 && (
                <Card className="border-2 border-dashed border-muted">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No recent workouts</p>
                    <Button variant="outline" onClick={handleCreateWorkout}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Workout
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <CreateWorkoutDialog 
          open={showCreateWorkout}
          workout={newWorkout}
          onSave={handleSaveNewWorkout}
          onClose={() => setShowCreateWorkout(false)}
          onUpdateWorkout={setNewWorkout}
          onAddExercise={handleAddExerciseToWorkout}
          onUpdateExercise={handleUpdateExerciseInWorkout}
          onRemoveExercise={handleRemoveExerciseFromWorkout}
        />

        <AlertDialog open={!!workoutToDelete} onOpenChange={() => setWorkoutToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{workoutToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteWorkout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ScheduleDialog 
          open={showScheduleDialog}
          onClose={() => setShowScheduleDialog(false)}
          workouts={workouts}
          scheduledWorkouts={scheduledWorkouts}
          onScheduleWorkout={scheduleWorkout}
          onRemoveScheduledWorkout={removeScheduledWorkout}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

      </div>
    </div>
  );
};

interface CreateWorkoutDialogProps {
  open: boolean;
  workout: {
    name: string;
    type: "Strength" | "Cardio" | "HIIT" | "Yoga";
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    duration: number;
    exercises: Exercise[];
  };
  onSave: () => void;
  onClose: () => void;
  onUpdateWorkout: (workout: any) => void;
  onAddExercise: () => void;
  onUpdateExercise: (exerciseId: string, updates: Partial<Exercise>) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

const CreateWorkoutDialog = ({ 
  open, 
  workout, 
  onSave, 
  onClose, 
  onUpdateWorkout,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise
}: CreateWorkoutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Workout Name</label>
              <Input
                placeholder="Enter workout name"
                value={workout.name}
                onChange={(e) => onUpdateWorkout({ ...workout, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select 
                  value={workout.type} 
                  onValueChange={(value) => onUpdateWorkout({ ...workout, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="HIIT">HIIT</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select 
                  value={workout.difficulty} 
                  onValueChange={(value) => onUpdateWorkout({ ...workout, difficulty: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Duration (min)</label>
                <Input
                  type="number"
                  min="10"
                  max="120"
                  value={workout.duration}
                  onChange={(e) => onUpdateWorkout({ ...workout, duration: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>
          </div>
          
          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Exercises</h3>
              <Button onClick={onAddExercise} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
            
            {workout.exercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                No exercises added yet. Click "Add Exercise" to start building your workout.
              </div>
            ) : (
              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Exercise {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRemoveExercise(exercise.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => onUpdateExercise(exercise.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Target muscles"
                          value={exercise.target}
                          onChange={(e) => onUpdateExercise(exercise.id, { target: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Sets</label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={exercise.defaultSets}
                          onChange={(e) => onUpdateExercise(exercise.id, { defaultSets: parseInt(e.target.value) || 3 })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          {workout.type === 'HIIT' ? 'Seconds' : 'Reps'}
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.defaultReps}
                          onChange={(e) => onUpdateExercise(exercise.id, { defaultReps: parseInt(e.target.value) || 10 })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ExerciseDialogProps {
  exercise: Exercise | null;
  onSave: (exerciseId: string, sets: ExerciseSet[]) => void;
  onClose: () => void;
}

const ExerciseDialog = ({ exercise, onSave, onClose }: ExerciseDialogProps) => {
  const [sets, setSets] = useState<ExerciseSet[]>([]);

  React.useEffect(() => {
    if (exercise) {
      if (exercise.sets.length > 0) {
        setSets(exercise.sets);
      } else {
        const initialSets = Array.from({ length: exercise.defaultSets }, () => ({
          reps: exercise.defaultReps,
          weight: 0,
          completed: false
        }));
        setSets(initialSets);
      }
    }
  }, [exercise]);

  const updateSet = (index: number, field: keyof ExerciseSet, value: number | boolean) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const addSet = () => {
    setSets(prev => [...prev, {
      reps: exercise?.defaultReps || 10,
      weight: 0,
      completed: false
    }]);
  };

  const removeSet = (index: number) => {
    setSets(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (exercise) {
      onSave(exercise.id, sets);
    }
  };

  if (!exercise) return null;

  return (
    <Dialog open={!!exercise} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Target: {exercise.target}</p>
          
          <div className="space-y-3">
            {sets.map((set, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <span className="text-sm font-medium w-12">Set {index + 1}</span>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                    className="w-16 text-center"
                  />
                  <span className="text-xs text-muted-foreground">reps</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Weight"
                    value={set.weight}
                    onChange={(e) => updateSet(index, 'weight', parseInt(e.target.value) || 0)}
                    className="w-16 text-center"
                  />
                  <span className="text-xs text-muted-foreground">lbs</span>
                </div>
                
                <Button
                  variant={set.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSet(index, 'completed', !set.completed)}
                  className="ml-2"
                >
                  {set.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </Button>
                
                {sets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSet(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button variant="outline" onClick={addSet} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Set
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  workouts: Workout[];
  scheduledWorkouts: {[key: string]: {workout: Workout, time: string}[]};
  onScheduleWorkout: (workout: Workout, date: Date, time: string) => void;
  onRemoveScheduledWorkout: (date: Date, index: number) => void;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

const ScheduleDialog = ({ 
  open, 
  onClose, 
  workouts, 
  scheduledWorkouts, 
  onScheduleWorkout, 
  onRemoveScheduledWorkout,
  selectedDate,
  onSelectDate
}: ScheduleDialogProps) => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedTime, setSelectedTime] = useState("09:00");

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSchedule = () => {
    if (selectedDate && selectedWorkout) {
      onScheduleWorkout(selectedWorkout, selectedDate, selectedTime);
      setSelectedWorkout(null);
    }
  };

  const getScheduledWorkoutsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return scheduledWorkouts[dateKey] || [];
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Workout Schedule</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelectDate}
              disabled={(date) => date < today}
              className="rounded-md border"
              modifiers={{
                scheduled: (date) => {
                  const dateKey = formatDateKey(date);
                  return !!scheduledWorkouts[dateKey]?.length;
                }
              }}
              modifiersStyles={{
                scheduled: {
                  backgroundColor: 'rgb(34 197 94)',
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>

          {/* Schedule Details */}
          <div className="space-y-4">
            {selectedDate ? (
              <>
                <h3 className="text-lg font-medium">
                  Schedule for {selectedDate.toLocaleDateString()}
                </h3>
                
                {/* Existing scheduled workouts */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Scheduled Workouts</h4>
                  {getScheduledWorkoutsForDate(selectedDate).length > 0 ? (
                    getScheduledWorkoutsForDate(selectedDate).map((scheduled, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{scheduled.workout.name}</p>
                          <p className="text-sm text-muted-foreground">{scheduled.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveScheduledWorkout(selectedDate, index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">No workouts scheduled for this date</p>
                  )}
                </div>

                {/* Add new workout */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground">Add Workout</h4>
                  
                  <div className="space-y-3">
                    <Select 
                      value={selectedWorkout?.id || ""} 
                      onValueChange={(value) => {
                        const workout = workouts.find(w => w.id === value);
                        setSelectedWorkout(workout || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workout" />
                      </SelectTrigger>
                      <SelectContent>
                        {workouts.map((workout) => (
                          <SelectItem key={workout.id} value={workout.id}>
                            {workout.name} ({workout.duration}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />

                    <Button 
                      onClick={handleSchedule} 
                      disabled={!selectedWorkout}
                      className="w-full"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Workout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Select a date to view or schedule workouts
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDashboard;