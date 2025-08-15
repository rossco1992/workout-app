-- Link existing workout to exercises
-- This migration connects the "Upper Body Push" workout to appropriate exercises

-- First, let's see what we have
-- SELECT * FROM workouts WHERE name LIKE '%Upper Body Push%';
-- SELECT * FROM exercises WHERE target_muscles LIKE '%Chest%' OR target_muscles LIKE '%Shoulder%' OR target_muscles LIKE '%Tricep%';

-- Link the Upper Body Push workout to appropriate exercises
INSERT INTO workout_exercises (workout_id, exercise_id, order_index, default_sets, default_reps, rest_time)
SELECT 
  w.id as workout_id,
  e.id as exercise_id,
  ROW_NUMBER() OVER () as order_index,
  3 as default_sets,
  10 as default_reps,
  60 as rest_time
FROM workouts w, exercises e
WHERE w.name LIKE '%Upper Body Push%'
AND (
  e.target_muscles LIKE '%Chest%' 
  OR e.target_muscles LIKE '%Shoulder%' 
  OR e.target_muscles LIKE '%Tricep%'
  OR e.name IN ('Push-ups', 'Dips', 'Pull-ups', 'Plank')
);

-- Verify the links were created
-- SELECT 
--   w.name as workout_name,
--   e.name as exercise_name,
--   we.order_index,
--   we.default_sets,
--   we.default_reps,
--   we.rest_time
-- FROM workout_exercises we
-- JOIN workouts w ON we.workout_id = w.id
-- JOIN exercises e ON we.exercise_id = e.id
-- WHERE w.name LIKE '%Upper Body Push%'
-- ORDER BY we.order_index;
