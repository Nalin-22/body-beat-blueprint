
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, Plus, PieChart, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  time: string;
  date: string;
}

const CalorieCounter = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  
  const dailyCalorieGoal = 2000; // Example goal

  useEffect(() => {
    // Load food entries from localStorage
    const savedEntries = localStorage.getItem('calorieEntries');
    if (savedEntries) {
      setFoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleAddFoodEntry = () => {
    if (!foodName || !calories) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNaN(Number(calories)) || Number(calories) <= 0) {
      toast.error('Please enter a valid calorie amount');
      return;
    }

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: foodName,
      calories: Number(calories),
      time: format(new Date(), 'h:mm a'),
      date: new Date().toISOString(),
    };

    const updatedEntries = [...foodEntries, newEntry];
    setFoodEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('calorieEntries', JSON.stringify(updatedEntries));
    
    // Reset form
    setFoodName('');
    setCalories('');
    setDialogOpen(false);
    
    toast.success('Food entry added successfully');
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = foodEntries.filter(entry => entry.id !== id);
    setFoodEntries(updatedEntries);
    localStorage.setItem('calorieEntries', JSON.stringify(updatedEntries));
    toast.success('Food entry removed');
  };

  // Filter entries for today
  const todayEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  });

  // Calculate total calories for today
  const totalCaloriesToday = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  
  // Group entries by meal type for today
  const breakfastEntries = todayEntries.filter(entry => {
    const hour = new Date(entry.date).getHours();
    return hour >= 5 && hour < 11;
  });
  
  const lunchEntries = todayEntries.filter(entry => {
    const hour = new Date(entry.date).getHours();
    return hour >= 11 && hour < 16;
  });
  
  const dinnerEntries = todayEntries.filter(entry => {
    const hour = new Date(entry.date).getHours();
    return hour >= 16 && hour < 22;
  });
  
  const snackEntries = todayEntries.filter(entry => {
    const hour = new Date(entry.date).getHours();
    return hour < 5 || hour >= 22;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-orange-500/10 p-3">
            <Apple className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Calorie Counter</h1>
            <p className="text-gray-600">Track your daily food intake</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
              <DialogDescription>
                Track what you've eaten and its calorie content
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="food-name">Food Name</Label>
                <Input 
                  id="food-name" 
                  placeholder="e.g., Grilled Chicken Salad" 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  placeholder="e.g., 350" 
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger id="meal-type">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFoodEntry}>
                Add Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Daily Consumption</div>
                <div className="text-sm">{totalCaloriesToday} / {dailyCalorieGoal} kcal</div>
              </div>
              <Progress 
                value={(totalCaloriesToday / dailyCalorieGoal) * 100} 
                className="h-2"
                indicatorClassName={
                  totalCaloriesToday > dailyCalorieGoal ? "bg-red-500" : "bg-fitness-teal"
                }
              />
            </div>

            <div className="flex items-center bg-orange-50 p-3 rounded-md">
              <PieChart className="h-5 w-5 text-orange-500 mr-3" />
              <div className="text-sm">
                {totalCaloriesToday < dailyCalorieGoal ? (
                  <p>You have <span className="font-medium">{dailyCalorieGoal - totalCaloriesToday} calories</span> left for today</p>
                ) : (
                  <p>You've exceeded your goal by <span className="font-medium">{totalCaloriesToday - dailyCalorieGoal} calories</span></p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Food Entries</CardTitle>
            <CardDescription>
              {todayEntries.length} food item{todayEntries.length !== 1 ? 's' : ''} recorded today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayEntries.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                {[
                  { title: 'Breakfast', entries: breakfastEntries },
                  { title: 'Lunch', entries: lunchEntries },
                  { title: 'Dinner', entries: dinnerEntries },
                  { title: 'Snacks', entries: snackEntries }
                ].map((mealGroup, idx) => (
                  mealGroup.entries.length > 0 && (
                    <div key={idx} className="mb-6 last:mb-0">
                      <h3 className="font-medium mb-3">{mealGroup.title}</h3>
                      {mealGroup.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 border rounded-md mb-2 last:mb-0"
                        >
                          <div>
                            <div className="font-medium">{entry.name}</div>
                            <div className="text-sm text-gray-500">{entry.time}</div>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-4">{entry.calories} kcal</span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </ScrollArea>
            ) : (
              <div className="text-center py-10">
                <Apple className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No food entries yet</h3>
                <p className="text-gray-500 mb-4">Start adding what you eat to track your calories</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Food Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalorieCounter;
