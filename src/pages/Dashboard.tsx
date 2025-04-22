
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dumbbell, 
  History, 
  LineChart, 
  Target, 
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface WorkoutHistoryItem {
  id: string;
  title: string;
  date: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [todayCalories, setTodayCalories] = useState(0);
  const [latestWorkout, setLatestWorkout] = useState<WorkoutHistoryItem | null>(null);
  const [bmiData, setBmiData] = useState<{ bmi: number | null, category: string }>({ bmi: null, category: '' });

  useEffect(() => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history.length > 0) {
        setLatestWorkout(history[history.length - 1]);
      }
    }

    const savedEntries = localStorage.getItem('calorieEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      const today = new Date().toDateString();
      const todayEntries = entries.filter((entry: any) => 
        new Date(entry.date).toDateString() === today
      );
      const total = todayEntries.reduce((sum: number, entry: any) => sum + entry.calories, 0);
      setTodayCalories(total);
    }

    const savedBmi = localStorage.getItem('bmiData');
    if (savedBmi) {
      setBmiData(JSON.parse(savedBmi));
    }
  }, []);

  const getBmiColor = (bmi: number | null) => {
    if (!bmi) return '#gray';
    if (bmi < 18.5) return '#3b82f6';
    if (bmi >= 18.5 && bmi < 25) return '#22c55e';
    if (bmi >= 25 && bmi < 30) return '#eab308';
    return '#ef4444';
  };

  const bmiChartData = [
    {
      name: 'BMI',
      value: bmiData.bmi || 0,
      fill: getBmiColor(bmiData.bmi),
    },
  ];

  // Get user's name from metadata or profile
  const userName = user?.user_metadata?.name || '';

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Welcome back{userName ? `, ${userName}` : ''}</h1>
        <p className="text-gray-600">Here's an overview of your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-fitness-purple">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Latest Workout</CardTitle>
            <CardDescription>Your most recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-start">
              <div className="mr-4 rounded-full bg-fitness-purple/10 p-2">
                <Dumbbell className="h-5 w-5 text-fitness-purple" />
              </div>
              <div className="flex-1">
                {latestWorkout ? (
                  <>
                    <p className="font-medium">{latestWorkout.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(latestWorkout.date).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">No workouts yet</p>
                    <p className="text-sm text-gray-500">Start your fitness journey</p>
                  </>
                )}
              </div>
              <Link to="/dashboard/workout-plans">
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Calories Today</CardTitle>
            <CardDescription>Track your nutrition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-start">
              <div className="mr-4 rounded-full bg-orange-500/10 p-2">
                <LineChart className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{todayCalories} kcal</p>
                <p className="text-sm text-gray-500">Daily intake</p>
              </div>
              <Link to="/dashboard/calorie-counter">
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">BMI Status</CardTitle>
            <CardDescription>{bmiData.bmi ? bmiData.category : 'Not calculated'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-start">
              <div className="w-24 h-24 mr-4">
                {bmiData.bmi && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="60%"
                      outerRadius="100%"
                      data={bmiChartData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 40]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={30}
                        fill={getBmiColor(bmiData.bmi)}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex-1">
                {bmiData.bmi ? (
                  <p className="text-2xl font-bold">{bmiData.bmi.toFixed(1)}</p>
                ) : (
                  <p className="text-sm text-gray-500">Not calculated</p>
                )}
                <Link to="/dashboard/bmi-calculator">
                  <Button variant="ghost" size="sm">
                    Calculate <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-left">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/dashboard/workout-plans" className="flex">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer w-full">
              <CardContent className="p-6 flex flex-col items-start">
                <div className="rounded-full bg-fitness-purple/10 p-4 mb-4 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-fitness-purple" />
                </div>
                <h3 className="font-medium mb-1 text-left">Workout Plans</h3>
                <p className="text-sm text-gray-500 text-left">Discover workout routines</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/workout-history">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-fitness-teal/10 p-4 mb-4 flex items-center justify-center">
                  <History className="h-6 w-6 text-fitness-teal" />
                </div>
                <h3 className="font-medium mb-1 text-center">Workout History</h3>
                <p className="text-sm text-gray-500 text-center">Review your activity</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/calorie-counter">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-orange-500/10 p-4 mb-4 flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-medium mb-1 text-center">Calorie Counter</h3>
                <p className="text-sm text-gray-500 text-center">Track your nutrition</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/bmi-calculator">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-blue-500/10 p-4 mb-4 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium mb-1 text-center">BMI Calculator</h3>
                <p className="text-sm text-gray-500 text-center">Check your BMI status</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
