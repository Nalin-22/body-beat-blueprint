
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, Plus, PieChart, Trash2, Utensils, Bell } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { foodDatabase, FoodItem, calculateCalories } from '../data/foodDatabase';
import { NotificationService } from '../services/NotificationService';

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
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [foodCategory, setFoodCategory] = useState<string>('vegetable');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [mealType, setMealType] = useState('breakfast');
  
  // Custom food entry fields
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  
  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const dailyCalorieGoal = 2000; // Example goal

  useEffect(() => {
    // Load food entries from localStorage
    const savedEntries = localStorage.getItem('calorieEntries');
    if (savedEntries) {
      setFoodEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  useEffect(() => {
    if (selectedFoodId) {
      const food = foodDatabase.find(item => item.id === selectedFoodId);
      setSelectedFood(food || null);
    } else {
      setSelectedFood(null);
    }
  }, [selectedFoodId]);
  
  useEffect(() => {
    const checkNotificationStatus = async () => {
      if ("Notification" in window) {
        const status = Notification.permission === "granted";
        setNotificationsEnabled(status);
      }
    };
    
    checkNotificationStatus();
  }, []);

  const handleAddFoodEntry = () => {
    if (!selectedFood || !weight) {
      toast.error('Please select a food item and enter weight');
      return;
    }

    if (isNaN(Number(weight)) || Number(weight) <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    const calculatedCalories = calculateCalories(selectedFood.id, Number(weight));
    
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: `${selectedFood.name} (${weight}g)`,
      calories: calculatedCalories,
      time: format(new Date(), 'h:mm a'),
      date: new Date().toISOString(),
    };

    const updatedEntries = [...foodEntries, newEntry];
    setFoodEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('calorieEntries', JSON.stringify(updatedEntries));
    
    // Reset form
    setSelectedFoodId('');
    setWeight('');
    setDialogOpen(false);
    
    toast.success('Food entry added successfully');
  };
  
  const handleAddCustomFoodEntry = () => {
    if (!customFoodName || !customCalories) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNaN(Number(customCalories)) || Number(customCalories) <= 0) {
      toast.error('Please enter a valid calorie amount');
      return;
    }

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: customFoodName,
      calories: Number(customCalories),
      time: format(new Date(), 'h:mm a'),
      date: new Date().toISOString(),
    };

    const updatedEntries = [...foodEntries, newEntry];
    setFoodEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('calorieEntries', JSON.stringify(updatedEntries));
    
    // Reset form
    setCustomFoodName('');
    setCustomCalories('');
    setCustomDialogOpen(false);
    
    toast.success('Custom food entry added successfully');
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = foodEntries.filter(entry => entry.id !== id);
    setFoodEntries(updatedEntries);
    localStorage.setItem('calorieEntries', JSON.stringify(updatedEntries));
    toast.success('Food entry removed');
  };
  
  const toggleNotifications = async () => {
    const notificationService = NotificationService.getInstance();
    const granted = await notificationService.initialize();
    
    if (granted) {
      if (!notificationsEnabled) {
        notificationService.startWorkoutReminders();
        notificationService.startMovementDetection();
        setNotificationsEnabled(true);
        toast.success('Notifications enabled');
      } else {
        notificationService.stopWorkoutReminders();
        notificationService.stopMovementDetection();
        setNotificationsEnabled(false);
        toast.success('Notifications disabled');
      }
    } else {
      toast.error('Notification permission denied');
    }
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
  
  // Get foods by selected category
  const foodsByCategory = foodDatabase.filter(food => food.category === foodCategory);

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
        <div className="flex space-x-2">
          <Button variant={notificationsEnabled ? "default" : "outline"} onClick={toggleNotifications}>
            <Bell className={`mr-2 h-4 w-4 ${notificationsEnabled ? "" : "text-muted-foreground"}`} />
            {notificationsEnabled ? "Notifications On" : "Enable Notifications"}
          </Button>
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
                  Select food from our database and track your calories
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="food-category">Food Category</Label>
                  <Select value={foodCategory} onValueChange={setFoodCategory}>
                    <SelectTrigger id="food-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetable">Vegetables</SelectItem>
                      <SelectItem value="fruit">Fruits</SelectItem>
                      <SelectItem value="oil">Oils</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="food-item">Food Item</Label>
                  <Select value={selectedFoodId} onValueChange={setSelectedFoodId}>
                    <SelectTrigger id="food-item">
                      <SelectValue placeholder="Select food item" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodsByCategory.map((food) => (
                        <SelectItem key={food.id} value={food.id}>
                          {food.name} ({food.caloriesPer100g} cal/100g)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="weight">Amount (grams)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    placeholder="e.g., 100" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                
                {selectedFood && weight && !isNaN(Number(weight)) && Number(weight) > 0 && (
                  <div className="p-3 bg-orange-50 rounded-md">
                    <p className="text-sm">
                      Calculated Calories: <span className="font-medium">{calculateCalories(selectedFood.id, Number(weight))}</span> kcal
                    </p>
                  </div>
                )}
                
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
              <DialogFooter className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setCustomDialogOpen(true)}>
                  <Utensils className="mr-2 h-4 w-4" /> Custom Food
                </Button>
                <div>
                  <Button variant="outline" className="mr-2" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFoodEntry} disabled={!selectedFood || !weight || isNaN(Number(weight)) || Number(weight) <= 0}>
                    Add Entry
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Custom Food Entry</DialogTitle>
                <DialogDescription>
                  Enter details for a food item not in our database
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="custom-food-name">Food Name</Label>
                  <Input 
                    id="custom-food-name" 
                    placeholder="e.g., Homemade Salad" 
                    value={customFoodName}
                    onChange={(e) => setCustomFoodName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="custom-calories">Calories</Label>
                  <Input 
                    id="custom-calories" 
                    type="number" 
                    placeholder="e.g., 350" 
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="custom-meal-type">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger id="custom-meal-type">
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
                <Button variant="outline" onClick={() => {
                  setCustomDialogOpen(false);
                  setDialogOpen(true);
                }}>
                  Back
                </Button>
                <Button onClick={handleAddCustomFoodEntry}>
                  Add Custom Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                className={`h-2 ${totalCaloriesToday > dailyCalorieGoal ? "bg-red-500" : ""}`}
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
