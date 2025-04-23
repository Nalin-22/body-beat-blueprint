import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dumbbell, Plus, Clock, Flame, Play } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import ExerciseDemo from '@/components/ExerciseDemo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const workouts = {
  beginner: [
    {
      id: 'b1',
      title: 'Full Body Basics',
      description: 'A complete workout focusing on all major muscle groups',
      duration: '30 minutes',
      intensity: 'Low',
      caloriesBurned: 150,
      exercises: [
        { 
          name: 'Push-ups', 
          sets: 2, 
          reps: 10,
          demoUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDM2bzZvcWk0bmdrY3hydzJseXphOGxyaWZsdms1d2gzenBtazBidyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5t9IcXiBCyw60XPpGu/giphy.gif'
        },
        { 
          name: 'Body-weight Squats', 
          sets: 2, 
          reps: 15,
          demoUrl: 'https://giphy.com/gifs/fitness-squat-l1J9EdzfmzgjmOSWY'
        },
        { name: 'Plank', sets: 2, time: '30 seconds' },
        { name: 'Lunges', sets: 2, reps: 10 },
        { name: 'Mountain Climbers', sets: 2, time: '30 seconds' }
      ]
    },
    {
      id: 'b2',
      title: 'Core Fundamentals',
      description: 'Focus on building a strong core foundation',
      duration: '20 minutes',
      intensity: 'Low',
      caloriesBurned: 100,
      exercises: [
        { name: 'Crunches', sets: 2, reps: 15 },
        { name: 'Plank', sets: 3, time: '30 seconds' },
        { name: 'Russian Twists', sets: 2, reps: 20 },
        { name: 'Leg Raises', sets: 2, reps: 12 }
      ]
    }
  ],
  intermediate: [
    {
      id: 'i1',
      title: 'Upper Body Power',
      description: 'Build strength and definition in your upper body',
      duration: '45 minutes',
      intensity: 'Medium',
      caloriesBurned: 300,
      exercises: [
        { 
          name: 'Push-ups', 
          sets: 3, 
          reps: 15,
          demoUrl: 'https://giphy.com/gifs/pushup-l0HlBO7ysZfLh23aU'
        },
        { name: 'Dumbbell Rows', sets: 3, reps: 12 },
        { name: 'Shoulder Press', sets: 3, reps: 12 },
        { name: 'Tricep Dips', sets: 3, reps: 12 },
        { name: 'Pull-ups', sets: 3, reps: 8 }
      ]
    },
    {
      id: 'i2',
      title: 'Lower Body Focus',
      description: 'Strengthen your legs and improve stability',
      duration: '40 minutes',
      intensity: 'Medium',
      caloriesBurned: 280,
      exercises: [
        { name: 'Squats', sets: 3, reps: 15 },
        { name: 'Lunges', sets: 3, reps: 12 },
        { name: 'Calf Raises', sets: 3, reps: 20 },
        { name: 'Glute Bridges', sets: 3, reps: 15 }
      ]
    }
  ],
  advanced: [
    {
      id: 'a1',
      title: 'High Intensity Interval Training',
      description: 'Maximum calorie burn and conditioning',
      duration: '30 minutes',
      intensity: 'High',
      caloriesBurned: 400,
      exercises: [
        { name: 'Burpees', sets: 4, time: '45 seconds', rest: '15 seconds' },
        { name: 'Mountain Climbers', sets: 4, time: '45 seconds', rest: '15 seconds' },
        { name: 'Jump Squats', sets: 4, time: '45 seconds', rest: '15 seconds' },
        { name: 'High Knees', sets: 4, time: '45 seconds', rest: '15 seconds' }
      ]
    },
    {
      id: 'a2',
      title: 'Total Body Strength',
      description: 'Build strength and muscle across your entire body',
      duration: '60 minutes',
      intensity: 'High',
      caloriesBurned: 450,
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: 8 },
        { name: 'Bench Press', sets: 4, reps: 8 },
        { name: 'Squats', sets: 4, reps: 10 },
        { name: 'Pull-ups', sets: 4, reps: 8 },
        { name: 'Military Press', sets: 4, reps: 8 }
      ]
    }
  ],
  custom: []
};

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  time?: string;
  rest?: string;
  demoUrl?: string;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  duration: string;
  intensity: string;
  caloriesBurned: number;
  exercises: Exercise[];
}

const WorkoutPlans = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const startWorkout = async (workout: Workout) => {
    if (!user) {
      toast.error('Please login to start a workout');
      return;
    }

    try {
      const { error } = await supabase
        .from('workout_history')
        .insert({
          title: workout.title,
          user_id: user.id,
          date: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast.success(`Started: ${workout.title}`);
      navigate('/dashboard/workout-history');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to start workout');
    }
  };

  const handleCreateWorkout = () => {
    navigate('/dashboard/create-workout');
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-fitness-purple/10 p-3">
            <Dumbbell className="h-6 w-6 text-fitness-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Workout Plans</h1>
            <p className="text-gray-600">Choose a workout or create your own</p>
          </div>
        </div>
        <Button onClick={handleCreateWorkout}>
          <Plus className="mr-2 h-4 w-4" /> Create Workout
        </Button>
      </div>

      <Tabs defaultValue="beginner">
        <TabsList className="mb-6">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {['beginner', 'intermediate', 'advanced', 'custom'].map((level) => (
          <TabsContent value={level} key={level} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workouts[level as keyof typeof workouts].length > 0 ? (
                workouts[level as keyof typeof workouts].map((workout) => (
                  <Card key={workout.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{workout.title}</CardTitle>
                      <CardDescription>{workout.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">{workout.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1 text-gray-500" />
                          <Badge variant="outline" className={getIntensityColor(workout.intensity)}>
                            {workout.intensity} Intensity
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1 text-orange-500" />
                          <span className="text-sm">{workout.caloriesBurned} cal</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Exercises:</h4>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {workout.exercises.slice(0, 3).map((exercise, index) => (
                            <li key={index}>• {exercise.name}</li>
                          ))}
                          {workout.exercises.length > 3 && (
                            <li>• +{workout.exercises.length - 3} more exercises</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedWorkout(workout)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <Dumbbell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No custom workouts yet</h3>
                  <p className="text-gray-500 mb-4">Create your first custom workout plan</p>
                  <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Workout
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedWorkout && (
        <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedWorkout.title}</DialogTitle>
              <DialogDescription>{selectedWorkout.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{selectedWorkout.duration}</span>
                </div>
                <div className="flex items-center">
                  <Flame className="h-4 w-4 mr-1 text-gray-500" />
                  <Badge variant="outline" className={getIntensityColor(selectedWorkout.intensity)}>
                    {selectedWorkout.intensity} Intensity
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Flame className="h-4 w-4 mr-1 text-orange-500" />
                  <span className="text-sm">{selectedWorkout.caloriesBurned} cal</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Exercises</h4>
                <ScrollArea className="h-[200px] rounded border p-4">
                  <div className="space-y-4">
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{exercise.name}</h5>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {exercise.sets && exercise.reps && (
                            <p>{exercise.sets} sets × {exercise.reps} reps</p>
                          )}
                          {exercise.sets && exercise.time && (
                            <p>{exercise.sets} sets × {exercise.time}</p>
                          )}
                          {exercise.rest && (
                            <p>Rest: {exercise.rest}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <DialogFooter className="sm:justify-start">
              <Button onClick={() => startWorkout(selectedWorkout)}>
                Start Workout
              </Button>
              <Button variant="outline" onClick={() => setSelectedWorkout(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedExercise && (
        <ExerciseDemo
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Custom Workout</DialogTitle>
            <DialogDescription>
              This feature will be available soon. You'll be able to create your own custom workout routines.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlans;
