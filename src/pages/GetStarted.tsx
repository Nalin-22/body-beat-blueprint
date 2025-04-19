
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, ChevronRight, Heart, Trophy, Target } from 'lucide-react';

const GetStarted = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Track Your Workouts",
      description: "Access workout plans for different fitness goals and track your progress over time.",
      icon: <Dumbbell className="h-16 w-16 text-fitness-purple" />
    },
    {
      title: "Monitor Your Health",
      description: "Keep track of your nutrition intake and calculate your BMI to stay on top of your health goals.",
      icon: <Heart className="h-16 w-16 text-fitness-purple" />
    },
    {
      title: "Achieve Your Goals",
      description: "Set personal fitness goals and track your achievements with our comprehensive tools.",
      icon: <Trophy className="h-16 w-16 text-fitness-purple" />
    },
    {
      title: "Personalize Your Journey",
      description: "Create custom workout plans tailored to your specific needs and preferences.",
      icon: <Target className="h-16 w-16 text-fitness-purple" />
    }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FitTrack</h1>
          <p className="text-gray-600">Your personal fitness companion</p>
        </div>

        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              {slides[currentSlide].icon}
              <h2 className="text-2xl font-bold mt-6 mb-2">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-600 mb-8">
                {slides[currentSlide].description}
              </p>
              
              <div className="flex justify-center space-x-2 mb-6">
                {slides.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-fitness-purple w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="px-4"
                >
                  Back
                </Button>
                
                {currentSlide < slides.length - 1 ? (
                  <Button onClick={nextSlide} className="px-4">
                    Next
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Link to="/login">
                      <Button variant="outline" className="px-4">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="px-4">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {currentSlide !== slides.length - 1 && (
          <div className="text-center space-y-2">
            <Link to="/login" className="text-fitness-purple hover:text-fitness-purple/80 flex items-center justify-center">
              Sign In <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
            <Link to="/register" className="text-fitness-purple hover:text-fitness-purple/80 flex items-center justify-center">
              Create Account <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
