-- Create workout database schema
-- This migration sets up all tables needed for the workout tracking app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workout_types enum
CREATE TYPE workout_type AS ENUM ('Strength', 'Cardio', 'HIIT', 'Yoga');

-- Create difficulty_level enum
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Create workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type workout_type NOT NULL,
  difficulty difficulty_level NOT NULL,
  estimated_duration INTEGER NOT NULL, -- in minutes
  created_by UUID, -- Will reference auth.users(id) when auth is set up
  is_template BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  target_muscles TEXT,
  equipment_needed VARCHAR(255),
  exercise_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises junction table
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  default_sets INTEGER NOT NULL DEFAULT 3,
  default_reps INTEGER NOT NULL DEFAULT 10,
  default_duration INTEGER, -- for time-based exercises (HIIT, Cardio)
  rest_time INTEGER DEFAULT 60, -- rest time in seconds
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workout_id, exercise_id, order_index)
);

-- Create workout_sessions table
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  user_id UUID, -- Will reference auth.users(id) when auth is set up
  session_name VARCHAR(255),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  actual_duration INTEGER, -- actual duration in minutes
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise_sets table
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL(6,2), -- weight in lbs/kg
  duration INTEGER, -- duration in seconds for time-based exercises
  distance DECIMAL(8,2), -- distance for cardio exercises
  rest_time INTEGER, -- actual rest time taken
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_workouts table
CREATE TABLE scheduled_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  user_id UUID, -- Will reference auth.users(id) when auth is set up
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  reminder_minutes INTEGER DEFAULT 15, -- reminder notification time
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_workouts_user_id ON workouts(created_by);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_workout_id ON workout_sessions(workout_id);
CREATE INDEX idx_exercise_sets_session_id ON exercise_sets(session_id);
CREATE INDEX idx_scheduled_workouts_user_date ON scheduled_workouts(user_id, scheduled_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default exercises
INSERT INTO exercises (id, name, description, target_muscles, exercise_type) VALUES
  (uuid_generate_v4(), 'Push-ups', 'Classic bodyweight exercise for upper body strength', 'Chest, shoulders, triceps', 'Bodyweight'),
  (uuid_generate_v4(), 'Squats', 'Fundamental lower body exercise', 'Quadriceps, glutes, hamstrings', 'Bodyweight'),
  (uuid_generate_v4(), 'Plank', 'Core stability exercise', 'Core, shoulders', 'Bodyweight'),
  (uuid_generate_v4(), 'Burpees', 'Full body high-intensity exercise', 'Full body', 'Cardio'),
  (uuid_generate_v4(), 'Jumping Jacks', 'Basic cardio exercise', 'Cardio, legs', 'Cardio'),
  (uuid_generate_v4(), 'Mountain Climbers', 'Dynamic core exercise', 'Core, shoulders, cardio', 'Cardio'),
  (uuid_generate_v4(), 'Lunges', 'Unilateral lower body exercise', 'Quadriceps, glutes, hamstrings', 'Bodyweight'),
  (uuid_generate_v4(), 'Pull-ups', 'Upper body pulling exercise', 'Back, biceps', 'Bodyweight'),
  (uuid_generate_v4(), 'Dips', 'Tricep and chest exercise', 'Triceps, chest, shoulders', 'Bodyweight'),
  (uuid_generate_v4(), 'Russian Twists', 'Rotational core exercise', 'Obliques, core', 'Bodyweight');

-- Insert some default workout templates
INSERT INTO workouts (id, name, description, type, difficulty, estimated_duration, is_template) VALUES
  (uuid_generate_v4(), 'Upper Body Blast', 'Comprehensive upper body workout focusing on chest, back, shoulders, and arms', 'Strength', 'Intermediate', 45, true),
  (uuid_generate_v4(), 'Morning Cardio', 'Light cardio workout perfect for starting your day', 'Cardio', 'Beginner', 30, true),
  (uuid_generate_v4(), 'HIIT Circuit', 'High-intensity interval training for maximum calorie burn', 'HIIT', 'Advanced', 25, true),
  (uuid_generate_v4(), 'Core Crusher', 'Focused core and abdominal workout', 'Strength', 'Beginner', 20, true),
  (uuid_generate_v4(), 'Lower Body Power', 'Strength-focused lower body workout', 'Strength', 'Intermediate', 40, true);

-- Link exercises to workouts (simplified approach)
-- Upper Body Blast: Push-ups, Pull-ups, Dips, Plank
INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps)
SELECT 
  w.id,
  e.id,
  1,
  3,
  12
FROM workouts w, exercises e
WHERE w.name = 'Upper Body Blast' AND e.name = 'Push-ups';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps)
SELECT 
  w.id,
  e.id,
  2,
  3,
  10
FROM workouts w, exercises e
WHERE w.name = 'Upper Body Blast' AND e.name = 'Pull-ups';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps)
SELECT 
  w.id,
  e.id,
  3,
  3,
  10
FROM workouts w, exercises e
WHERE w.name = 'Upper Body Blast' AND e.name = 'Dips';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps)
SELECT 
  w.id,
  e.id,
  4,
  3,
  30
FROM workouts w, exercises e
WHERE w.name = 'Upper Body Blast' AND e.name = 'Plank';

-- Morning Cardio: Jumping Jacks, Mountain Climbers, Burpees
INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  1,
  3,
  20,
  45
FROM workouts w, exercises e
WHERE w.name = 'Morning Cardio' AND e.name = 'Jumping Jacks';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  2,
  3,
  20,
  45
FROM workouts w, exercises e
WHERE w.name = 'Morning Cardio' AND e.name = 'Mountain Climbers';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  3,
  3,
  10,
  30
FROM workouts w, exercises e
WHERE w.name = 'Morning Cardio' AND e.name = 'Burpees';

-- HIIT Circuit: Burpees, Mountain Climbers, Jumping Jacks, Push-ups, Squats
INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  1,
  3,
  45,
  45
FROM workouts w, exercises e
WHERE w.name = 'HIIT Circuit' AND e.name = 'Burpees';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  2,
  3,
  45,
  45
FROM workouts w, exercises e
WHERE w.name = 'HIIT Circuit' AND e.name = 'Mountain Climbers';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  3,
  3,
  30,
  30
FROM workouts w, exercises e
WHERE w.name = 'HIIT Circuit' AND e.name = 'Jumping Jacks';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  4,
  3,
  30,
  30
FROM workouts w, exercises e
WHERE w.name = 'HIIT Circuit' AND e.name = 'Push-ups';

INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, default_duration)
SELECT 
  w.id,
  e.id,
  5,
  3,
  30,
  30
FROM workouts w, exercises e
WHERE w.name = 'HIIT Circuit' AND e.name = 'Squats';

-- Enable Row Level Security (RLS)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (simplified for now - will need to be updated when auth is set up)
-- Users can view all template workouts and exercises
CREATE POLICY "Template workouts are viewable by everyone" ON workouts
  FOR SELECT USING (is_template = true);

CREATE POLICY "Exercises are viewable by everyone" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "Template workout exercises are viewable by everyone" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts w 
      WHERE w.id = workout_exercises.workout_id 
      AND w.is_template = true
    )
  );

-- For now, allow all operations - these policies will need to be updated when auth is implemented
CREATE POLICY "Allow all operations for now" ON workouts FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON workout_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON exercise_sets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON scheduled_workouts FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON workout_exercises FOR ALL USING (true);
