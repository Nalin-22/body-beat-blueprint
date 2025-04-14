
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, History, LineChart, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="text-gray-600">Here's an overview of your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-fitness-purple">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Latest Workout</CardTitle>
            <CardDescription>Your most recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-fitness-purple/10 p-2">
                  <Dumbbell className="h-5 w-5 text-fitness-purple" />
                </div>
                <div>
                  <p className="font-medium">No workouts yet</p>
                  <p className="text-sm text-gray-500">Start your fitness journey</p>
                </div>
              </div>
              <Link to="/dashboard/workout-plans">
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-fitness-teal">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Workout Streak</CardTitle>
            <CardDescription>Consistency is key</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-fitness-teal/10 p-2">
                  <History className="h-5 w-5 text-fitness-teal" />
                </div>
                <div>
                  <p className="font-medium">0 Days</p>
                  <p className="text-sm text-gray-500">Start a workout streak</p>
                </div>
              </div>
              <Link to="/dashboard/workout-history">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-orange-500/10 p-2">
                  <LineChart className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">0 kcal</p>
                  <p className="text-sm text-gray-500">Log your meals</p>
                </div>
              </div>
              <Link to="/dashboard/calorie-counter">
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/dashboard/workout-plans">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-fitness-purple/10 p-4 mb-4">
                  <Dumbbell className="h-6 w-6 text-fitness-purple" />
                </div>
                <h3 className="font-medium mb-1">Workout Plans</h3>
                <p className="text-sm text-gray-500">Discover workout routines</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/workout-history">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-fitness-teal/10 p-4 mb-4">
                  <History className="h-6 w-6 text-fitness-teal" />
                </div>
                <h3 className="font-medium mb-1">Workout History</h3>
                <p className="text-sm text-gray-500">Review your activity</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/calorie-counter">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-orange-500/10 p-4 mb-4">
                  <LineChart className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-medium mb-1">Calorie Counter</h3>
                <p className="text-sm text-gray-500">Track your nutrition</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/bmi-calculator">
            <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium mb-1">BMI Calculator</h3>
                <p className="text-sm text-gray-500">Check your BMI status</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
