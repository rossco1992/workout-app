#!/usr/bin/env node

/**
 * Database Setup Script for Workout App
 * 
 * This script helps you set up the workout database in Supabase.
 * Run it with: node scripts/setup-database.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏋️  Workout App Database Setup');
console.log('================================\n');

// Check if Supabase config exists
const supabaseConfigPath = path.join(__dirname, '..', 'supabase', 'config.toml');
if (!fs.existsSync(supabaseConfigPath)) {
  console.error('❌ Supabase config not found!');
  console.error('Please make sure you have a Supabase project set up.');
  process.exit(1);
}

// Read the migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_create_workout_schema.sql');
if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found!');
  console.error('Please make sure the migration file exists.');
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Database Schema Overview:');
console.log('• workouts - Workout templates and custom workouts');
console.log('• exercises - Exercise definitions');
console.log('• workout_exercises - Workout-exercise relationships');
console.log('• workout_sessions - Completed workout sessions');
console.log('• exercise_sets - Individual set data');
console.log('• scheduled_workouts - Future workout scheduling\n');

console.log('🚀 Setup Instructions:\n');

console.log('1. Go to your Supabase project dashboard:');
console.log('   https://supabase.com/dashboard\n');

console.log('2. Navigate to SQL Editor in the left sidebar\n');

console.log('3. Copy and paste the following SQL script:\n');
console.log('─'.repeat(80));
console.log(migrationSQL);
console.log('─'.repeat(80));

console.log('\n4. Click "Run" to execute the script\n');

console.log('5. Verify the tables were created by going to Table Editor\n');

console.log('6. Check that the following tables exist:');
console.log('   ✅ workouts');
console.log('   ✅ exercises');
console.log('   ✅ workout_exercises');
console.log('   ✅ workout_sessions');
console.log('   ✅ exercise_sets');
console.log('   ✅ scheduled_workouts\n');

console.log('🎯 What happens next:');
console.log('• Default workout templates will be created');
console.log('• Exercise library will be populated');
console.log('• Row Level Security (RLS) will be enabled');
console.log('• Database indexes will be created for performance\n');

console.log('🔒 Security Features:');
console.log('• Users can only access their own workout data');
console.log('• Template workouts are viewable by everyone');
console.log('• Custom workouts are private to creators\n');

console.log('📊 Default Data Included:');
console.log('• 5 workout templates (Strength, Cardio, HIIT)');
console.log('• 10 common exercises with descriptions');
console.log('• Pre-configured workout-exercise relationships\n');

console.log('⚠️  Important Notes:');
console.log('• Make sure you have proper authentication set up');
console.log('• Test the connection before deploying to production');
console.log('• Monitor your database usage in Supabase dashboard\n');

console.log('📚 For more help:');
console.log('• Check DATABASE_SETUP.md for detailed instructions');
console.log('• Review Supabase documentation: https://supabase.com/docs');
console.log('• Check the app source code for usage examples\n');

console.log('✨ Happy coding! Your workout database is ready to use.');
