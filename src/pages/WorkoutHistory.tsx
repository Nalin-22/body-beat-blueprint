import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, CalendarIcon, ArrowRight, Database, HardDrive } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

interface WorkoutHistoryItem {
  id: string;
  title: string;
  date: string;
}

const WorkoutHistory = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const [localWorkouts, setLocalWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [combinedWorkouts, setCombinedWorkouts] = useState<WorkoutHistoryItem[]>([]);

  const { data: remoteWorkouts = [], isLoading, refetch } = useQuery({
    queryKey: ['workoutHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_history')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching workout history:', error);
        toast.error('Failed to load workout history');
        return [];
      }

      return data as WorkoutHistoryItem[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setLocalWorkouts(parsedHistory);
        }
      } catch (error) {
        console.error('Error parsing localStorage workout history:', error);
      }
    }
  }, []);

  useEffect(() => {
    const combined = [...remoteWorkouts];
    
    localWorkouts.forEach(localWorkout => {
      const isDuplicate = remoteWorkouts.some(remoteWorkout => 
        remoteWorkout.title === localWorkout.title && 
        new Date(remoteWorkout.date).toDateString() === new Date(localWorkout.date).toDateString()
      );
      
      if (!isDuplicate) {
        combined.push(localWorkout);
      }
    });
    
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setCombinedWorkouts(combined);
  }, [remoteWorkouts, localWorkouts]);

  const migrateLocalWorkouts = async () => {
    if (!user) {
      toast.error('Please log in to migrate your workout data');
      return;
    }

    try {
      const workoutsToMigrate = localWorkouts.filter(localWorkout => {
        return !remoteWorkouts.some(remoteWorkout => 
          remoteWorkout.title === localWorkout.title && 
          new Date(remoteWorkout.date).toDateString() === new Date(localWorkout.date).toDateString()
        );
      });

      if (workoutsToMigrate.length === 0) {
        toast.info('No new workouts to migrate');
        return;
      }

      const workoutsForDb = workoutsToMigrate.map(workout => ({
        title: workout.title,
        user_id: user.id,
        date: workout.date,
      }));

      const { error } = await supabase
        .from('workout_history')
        .insert(workoutsForDb);

      if (error) {
        console.error('Migration error:', error);
        throw error;
      }

      toast.success(`Successfully migrated ${workoutsToMigrate.length} workouts`);
      refetch();
    } catch (error) {
      console.error('Error migrating workouts:', error);
      toast.error('Failed to migrate workouts');
    }
  };

  const deleteLocalWorkout = (dateToDelete: string) => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      try {
        const parsedHistory: WorkoutHistoryItem[] = JSON.parse(savedHistory);
        
        const updatedHistory = parsedHistory.filter(workout => 
          new Date(workout.date).toDateString() !== new Date(dateToDelete).toDateString()
        );

        localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
        setLocalWorkouts(updatedHistory);

        toast.success(`Workout on ${format(new Date(dateToDelete), 'PPP')} deleted`);
      } catch (error) {
        console.error('Error deleting local workout:', error);
        toast.error('Failed to delete workout');
      }
    }
  };

  useEffect(() => {
    deleteLocalWorkout('2025-04-14');
    deleteLocalWorkout('2025-04-19');
  }, []);

  const filteredWorkouts = date ? combinedWorkouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate.toDateString() === date.toDateString();
  }) : [];

  const datesWithWorkouts = combinedWorkouts.map(item => new Date(item.date));

  const getWorkoutSource = (workout: WorkoutHistoryItem) => {
    const inLocal = localWorkouts.some(local => 
      local.title === workout.title && 
      new Date(local.date).toDateString() === new Date(workout.date).toDateString()
    );
    
    const inRemote = remoteWorkouts.some(remote => 
      remote.title === workout.title && 
      new Date(remote.date).toDateString() === new Date(workout.date).toDateString()
    );

    if (inLocal && inRemote) return 'both';
    if (inLocal) return 'local';
    return 'remote';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading workout history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-fitness-teal/10 p-3">
            <History className="h-6 w-6 text-fitness-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Workout History</h1>
            <p className="text-gray-600">Track your fitness journey progress</p>
          </div>
        </div>
        {localWorkouts.length > 0 && user && (
          <Button onClick={migrateLocalWorkouts} variant="outline" className="gap-2">
            <HardDrive className="h-4 w-4" />
            Migrate Local Workouts
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mb-4"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  modifiers={{
                    workout: datesWithWorkouts,
                  }}
                  modifiersStyles={{
                    workout: {
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      fontWeight: 'bold',
                      border: '2px solid #8B5CF6',
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="mt-4 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-fitness-purple mr-2"></div>
                <span className="text-gray-500">Workout day</span>
              </div>
              <div>
                <span className="font-medium">{combinedWorkouts.length}</span>
                <span className="text-gray-500 ml-1">Total workouts</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Database className="h-3 w-3" /> Database
                </Badge>
                <span>Stored online</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Badge variant="outline" className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> Local
                </Badge>
                <span>Stored on device</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? (
                <>Workouts on {format(date, 'MMMM d, yyyy')}</>
              ) : (
                <>All Workouts</>
              )}
            </CardTitle>
            <CardDescription>
              {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkouts.length > 0 ? (
              <div className="space-y-4">
                {filteredWorkouts.map((item, index) => {
                  const source = getWorkoutSource(item);
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 border rounded-md transition-all hover:shadow-md"
                    >
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500">
                            {format(new Date(item.date), 'h:mm a')}
                          </p>
                          {source === 'local' && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <HardDrive className="h-3 w-3" /> Local
                            </Badge>
                          )}
                          {source === 'remote' && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Database className="h-3 w-3" /> Database
                            </Badge>
                          )}
                          {source === 'both' && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Database className="h-3 w-3" /> <HardDrive className="h-3 w-3" /> Both
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                {combinedWorkouts.length > 0 ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No workouts on this day</h3>
                    <p className="text-gray-500">Select another date or start a workout</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No workout history</h3>
                    <p className="text-gray-500 mb-4">Start your first workout to begin tracking</p>
                    <Button asChild>
                      <a href="/dashboard/workout-plans">Find a Workout</a>
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutHistory;
