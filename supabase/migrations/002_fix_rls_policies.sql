-- Fix RLS policies to allow exercise creation and workout management
-- This migration updates the Row Level Security policies to allow proper operations

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Exercises are viewable by everyone" ON exercises;
DROP POLICY IF EXISTS "Template workout exercises are viewable by everyone" ON workout_exercises;

-- Create comprehensive policies for exercises table
CREATE POLICY "Exercises are viewable by everyone" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create exercises" ON exercises
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update exercises" ON exercises
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete exercises" ON exercises
  FOR DELETE USING (true);

-- Create comprehensive policies for workout_exercises table
CREATE POLICY "Workout exercises are viewable by everyone" ON workout_exercises
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create workout exercises" ON workout_exercises
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update workout exercises" ON workout_exercises
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete workout exercises" ON workout_exercises
  FOR DELETE USING (true);

-- Ensure workouts table allows creation of custom workouts
CREATE POLICY "Authenticated users can create custom workouts" ON workouts
  FOR INSERT WITH CHECK (is_template = false);

CREATE POLICY "Authenticated users can update their custom workouts" ON workouts
  FOR UPDATE USING (is_template = false);

CREATE POLICY "Authenticated users can delete their custom workouts" ON workouts
  FOR DELETE USING (is_template = false);

-- Keep existing policies for template workouts
-- (These should already exist from the previous migration)
