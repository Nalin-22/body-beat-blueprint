
// Basic database of common foods with calorie information per 100g
export interface FoodItem {
  id: string;
  name: string;
  category: 'vegetable' | 'fruit' | 'oil' | 'other';
  caloriesPer100g: number;
}

export const foodDatabase: FoodItem[] = [
  // Vegetables
  { id: 'v1', name: 'Carrot', category: 'vegetable', caloriesPer100g: 41 },
  { id: 'v2', name: 'Broccoli', category: 'vegetable', caloriesPer100g: 34 },
  { id: 'v3', name: 'Spinach', category: 'vegetable', caloriesPer100g: 23 },
  { id: 'v4', name: 'Potato', category: 'vegetable', caloriesPer100g: 77 },
  { id: 'v5', name: 'Tomato', category: 'vegetable', caloriesPer100g: 18 },
  { id: 'v6', name: 'Cucumber', category: 'vegetable', caloriesPer100g: 15 },
  { id: 'v7', name: 'Bell Pepper', category: 'vegetable', caloriesPer100g: 31 },
  { id: 'v8', name: 'Onion', category: 'vegetable', caloriesPer100g: 40 },
  { id: 'v9', name: 'Lettuce', category: 'vegetable', caloriesPer100g: 15 },
  { id: 'v10', name: 'Cabbage', category: 'vegetable', caloriesPer100g: 25 },
  
  // Fruits
  { id: 'f1', name: 'Apple', category: 'fruit', caloriesPer100g: 52 },
  { id: 'f2', name: 'Banana', category: 'fruit', caloriesPer100g: 89 },
  { id: 'f3', name: 'Orange', category: 'fruit', caloriesPer100g: 47 },
  { id: 'f4', name: 'Grapes', category: 'fruit', caloriesPer100g: 69 },
  { id: 'f5', name: 'Strawberry', category: 'fruit', caloriesPer100g: 32 },
  { id: 'f6', name: 'Blueberry', category: 'fruit', caloriesPer100g: 57 },
  { id: 'f7', name: 'Mango', category: 'fruit', caloriesPer100g: 60 },
  { id: 'f8', name: 'Pineapple', category: 'fruit', caloriesPer100g: 50 },
  { id: 'f9', name: 'Watermelon', category: 'fruit', caloriesPer100g: 30 },
  { id: 'f10', name: 'Avocado', category: 'fruit', caloriesPer100g: 160 },
  
  // Oils
  { id: 'o1', name: 'Olive Oil', category: 'oil', caloriesPer100g: 884 },
  { id: 'o2', name: 'Coconut Oil', category: 'oil', caloriesPer100g: 862 },
  { id: 'o3', name: 'Sunflower Oil', category: 'oil', caloriesPer100g: 884 },
  { id: 'o4', name: 'Canola Oil', category: 'oil', caloriesPer100g: 884 },
  { id: 'o5', name: 'Butter', category: 'oil', caloriesPer100g: 717 },
];

export const getFoodsByCategory = (category: string) => {
  return foodDatabase.filter(food => food.category === category);
};

export const calculateCalories = (foodId: string, weightInGrams: number): number => {
  const food = foodDatabase.find(item => item.id === foodId);
  if (!food) return 0;
  
  return Math.round((food.caloriesPer100g * weightInGrams) / 100);
};
