# Workout App Database Setup Guide

This guide will help you set up the database for your workout tracking app using Supabase.

## Prerequisites

1. **Supabase Account**: You need a Supabase account and project
2. **Supabase CLI** (optional but recommended for local development)
3. **Node.js and npm/bun** for running the app

## Database Schema Overview

The workout app uses the following database structure:

### Core Tables

1. **`workouts`** - Workout templates and custom workouts
2. **`exercises`** - Exercise definitions
3. **`workout_exercises`** - Junction table linking workouts to exercises
4. **`workout_sessions`** - Completed workout sessions
5. **`exercise_sets`** - Individual set data for each exercise
6. **`scheduled_workouts`** - Future workout scheduling

### Key Features

- **Row Level Security (RLS)** for user data protection
- **UUID primary keys** for scalability
- **Proper indexing** for performance
- **Default workout templates** included
- **Comprehensive exercise library**

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy the contents of `supabase/migrations/001_create_workout_schema.sql`**
4. **Paste and run the SQL script**
5. **Verify the tables were created in the Table Editor**

### Option 2: Using Supabase CLI (Advanced users)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run the migration**:
   ```bash
   supabase db push
   ```

## Database Configuration

### Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Client Configuration

The app automatically uses the Supabase client configured in `src/integrations/supabase/client.ts`.

## Database Features

### 1. Workout Templates

The database comes with pre-built workout templates:
- **Upper Body Blast** (Strength, Intermediate, 45 min)
- **Morning Cardio** (Cardio, Beginner, 30 min)
- **HIIT Circuit** (HIIT, Advanced, 25 min)
- **Core Crusher** (Strength, Beginner, 20 min)
- **Lower Body Power** (Strength, Intermediate, 40 min)

### 2. Exercise Library

Default exercises include:
- Push-ups, Squats, Plank
- Burpees, Jumping Jacks, Mountain Climbers
- Lunges, Pull-ups, Dips, Russian Twists

### 3. User Data Protection

- **Row Level Security (RLS)** ensures users can only access their own data
- **Template workouts** are viewable by everyone
- **Custom workouts** are private to the creator
- **Workout sessions** are user-specific

## Usage Examples

### Starting a Workout

```typescript
import { useWorkouts } from '@/hooks/useWorkouts'

const { startWorkoutSession } = useWorkouts()

// Start a workout session
const { session, exercises } = await startWorkoutSession(
  workoutId, 
  userId, 
  'Morning Workout'
)
```

### Saving Exercise Sets

```typescript
import { useWorkouts } from '@/hooks/useWorkouts'

const { saveExerciseSets } = useWorkouts()

// Save exercise sets
const sets = [
  {
    session_id: sessionId,
    exercise_id: exerciseId,
    set_number: 1,
    reps: 12,
    weight: 135,
    completed: true
  }
]

await saveExerciseSets(sets)
```

### Completing a Workout

```typescript
import { useWorkouts } from '@/hooks/useWorkouts'

const { completeWorkoutSession } = useWorkouts()

// Complete workout session
await completeWorkoutSession(
  sessionId,
  45, // duration in minutes
  'Great workout!', // notes
  5 // rating 1-5
)
```

## Database Maintenance

### Backup

- Use Supabase's built-in backup features
- Export data using the SQL Editor
- Use Supabase CLI for automated backups

### Monitoring

- Check the Supabase dashboard for:
  - Database performance metrics
  - Storage usage
  - API request counts
  - Error logs

### Scaling

- The database is designed to handle thousands of users
- Indexes are optimized for common queries
- Consider implementing pagination for large datasets

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check RLS policies are enabled
   - Verify user authentication
   - Check table permissions

2. **Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Ensure proper CORS configuration

3. **Performance Issues**
   - Check query performance in Supabase dashboard
   - Verify indexes are being used
   - Consider query optimization

### Getting Help

- Check Supabase documentation
- Review the app's error handling
- Use browser developer tools for debugging
- Check Supabase dashboard logs

## Next Steps

After setting up the database:

1. **Test the connection** by running the app
2. **Create a test user** and try the workout features
3. **Customize workout templates** for your needs
4. **Add more exercises** to the library
5. **Implement additional features** like progress tracking

## Security Considerations

- **Never expose your service role key** in client-side code
- **Use RLS policies** to control data access
- **Validate user input** before database operations
- **Monitor for suspicious activity** in your Supabase dashboard

## Performance Tips

- **Use indexes** for frequently queried columns
- **Implement pagination** for large result sets
- **Cache frequently accessed data** when appropriate
- **Monitor query performance** in Supabase dashboard

---

For more information, check out the [Supabase documentation](https://supabase.com/docs) and the app's source code.

