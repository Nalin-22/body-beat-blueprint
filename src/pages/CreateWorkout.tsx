
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import ExerciseSearch from '@/components/customWorkout/ExerciseSearch';
import WorkoutExerciseCard from '@/components/customWorkout/WorkoutExerciseCard';
import { useAuth } from '@/contexts/AuthContext';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle_group: string | null;
  difficulty: string | null;
}

interface WorkoutExercise {
  name: string;
  sets: number;
  reps?: number;
  time?: string;
  rest?: string;
}

const CreateWorkout = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from('exercise_database')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Failed to load exercises');
        return;
      }
      
      setExercises(data);
    };

    fetchExercises();
  }, []);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      { name: exercise.name, sets: 3 }
    ]);
  };

  const handleUpdateExercise = (index: number, exercise: WorkoutExercise) => {
    const newExercises = [...selectedExercises];
    newExercises[index] = exercise;
    setSelectedExercises(newExercises);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title) {
      toast.error('Please enter a workout title');
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    setIsLoading(true);

    try {
      // Insert the workout
      const { data: workout, error: workoutError } = await supabase
        .from('custom_workouts')
        .insert([
          { title, description, user_id: user?.id }
        ])
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Insert the exercises
      const exercisesData = selectedExercises.map((exercise, index) => ({
        workout_id: workout.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        time: exercise.time,
        rest: exercise.rest,
        order_index: index
      }));

      const { error: exercisesError } = await supabase
        .from('custom_workout_exercises')
        .insert(exercisesData);

      if (exercisesError) throw exercisesError;

      toast.success('Workout saved successfully');
      navigate('/dashboard/workout-plans');
    } catch (error) {
      toast.error('Failed to save workout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Create Custom Workout</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Workout Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter workout title"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter workout description"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Add Exercises</h2>
        <ExerciseSearch
          exercises={exercises}
          onSelectExercise={handleAddExercise}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Selected Exercises</h2>
        {selectedExercises.length === 0 ? (
          <p className="text-muted-foreground">No exercises added yet. Use the search above to add exercises.</p>
        ) : (
          <div className="space-y-4">
            {selectedExercises.map((exercise, index) => (
              <WorkoutExerciseCard
                key={index}
                exercise={exercise}
                index={index}
                onUpdate={(updated) => handleUpdateExercise(index, updated)}
                onRemove={() => handleRemoveExercise(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/workout-plans')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Workout'}
        </Button>
      </div>
    </div>
  );
};

export default CreateWorkout;
