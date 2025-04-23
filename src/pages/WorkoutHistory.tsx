
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, CalendarIcon, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface WorkoutHistoryItem {
  id: string;
  title: string;
  date: string;
}

const WorkoutHistory = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['workoutHistory', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_history')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching workout history:', error);
        return [];
      }

      return data as WorkoutHistoryItem[];
    },
    enabled: !!user,
  });

  // Filter workouts by selected date
  const filteredWorkouts = date ? history.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate.toDateString() === date.toDateString();
  }) : [];

  // Get dates with workouts for highlighting in calendar
  const datesWithWorkouts = history.map(item => new Date(item.date));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading workout history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="rounded-full bg-fitness-teal/10 p-3">
          <History className="h-6 w-6 text-fitness-teal" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Workout History</h1>
          <p className="text-gray-600">Track your fitness journey progress</p>
        </div>
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
                <span className="font-medium">{history.length}</span>
                <span className="text-gray-500 ml-1">Total workouts</span>
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
                {filteredWorkouts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(item.date), 'h:mm a')}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                {history.length > 0 ? (
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
