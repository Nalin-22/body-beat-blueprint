import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator } from 'lucide-react';

const BMICalculator = () => {
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const calculateBMI = () => {
    if (height && weight) {
      let bmiValue: number;

      if (unit === 'metric') {
        const heightInMeters = Number(height) / 100;
        bmiValue = Number(weight) / (heightInMeters * heightInMeters);
      } else {
        bmiValue = (Number(weight) * 703) / (Number(height) * Number(height));
      }

      setBmi(parseFloat(bmiValue.toFixed(1)));
    }
  };

  useEffect(() => {
    if (bmi !== null) {
      if (bmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (bmi >= 18.5 && bmi < 25) {
        setBmiCategory('Healthy Weight');
      } else if (bmi >= 25 && bmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obesity');
      }

      localStorage.setItem('bmiData', JSON.stringify({
        bmi: bmi,
        category: bmiCategory,
      }));
    }
  }, [bmi, bmiCategory]);

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setHeight(value === '' ? '' : parseFloat(value));
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value === '' ? '' : parseFloat(value));
    }
  };

  const handleUnitChange = (value: string) => {
    setUnit(value as 'metric' | 'imperial');
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
  };

  const getBmiCategoryColor = () => {
    switch (bmiCategory) {
      case 'Underweight':
        return 'text-blue-500';
      case 'Healthy Weight':
        return 'text-green-500';
      case 'Overweight':
        return 'text-yellow-500';
      case 'Obesity':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <div className="rounded-full bg-fitness-purple/10 p-3">
          <Calculator className="h-6 w-6 text-fitness-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">BMI Calculator</h1>
          <p className="text-gray-600">Calculate and track your Body Mass Index</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Your BMI</CardTitle>
          <CardDescription>
            Body Mass Index is a measure of body fat based on height and weight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metric" onValueChange={handleUnitChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
            </TabsList>
            <TabsContent value="metric">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Height in centimeters"
                    value={height}
                    onChange={handleHeightChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Weight in kilograms"
                    value={weight}
                    onChange={handleWeightChange}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="imperial">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Height in inches"
                    value={height}
                    onChange={handleHeightChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Weight in pounds"
                    value={weight}
                    onChange={handleWeightChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={calculateBMI} className="w-full mt-6" disabled={height === '' || weight === ''}>
            Calculate BMI
          </Button>

          {bmi !== null && (
            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-2">Your Result</h3>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold mb-2">{bmi}</div>
                <div className={`text-lg font-medium ${getBmiCategoryColor()}`}>
                  {bmiCategory}
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">
                  {bmiCategory === 'Underweight' && 'You may need to gain some weight. Consult with a healthcare provider.'}
                  {bmiCategory === 'Healthy Weight' && "You're at a healthy weight for your height. Maintain it with a balanced diet and regular exercise."}
                  {bmiCategory === 'Overweight' && 'You may benefit from losing some weight. Focus on healthy eating and exercise.'}
                  {bmiCategory === 'Obesity' && 'For your health, it is recommended to reduce your weight. Consider consulting a healthcare professional.'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BMICalculator;
