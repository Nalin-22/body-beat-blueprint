
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Calculator, 
  LogOut, 
  Menu, 
  Dumbbell, 
  History, 
  Apple, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      title: 'Home', 
      icon: <Home className="h-5 w-5" />, 
      path: '/dashboard'
    },
    { 
      title: 'Workout Plans', 
      icon: <Dumbbell className="h-5 w-5" />, 
      path: '/dashboard/workout-plans'
    },
    { 
      title: 'Workout History', 
      icon: <History className="h-5 w-5" />, 
      path: '/dashboard/workout-history'
    },
    { 
      title: 'Calorie Counter', 
      icon: <Apple className="h-5 w-5" />, 
      path: '/dashboard/calorie-counter'
    },
    { 
      title: 'BMI Calculator', 
      icon: <Calculator className="h-5 w-5" />, 
      path: '/dashboard/bmi-calculator'
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMenu} 
          className="rounded-full"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className={cn(
        "fixed top-0 left-0 h-full bg-sidebar z-40 transition-all duration-300 shadow-lg",
        isOpen ? "w-64" : "w-0 md:w-20",
        "md:relative md:h-screen"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h2 className={cn(
              "font-bold text-xl transition-all duration-300",
              isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
            )}>FitTrack</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              className="rounded-full hidden md:flex"
            >
              <ChevronRight className={cn(
                "h-5 w-5 transition-transform",
                !isOpen && "transform rotate-180"
              )} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="px-2 py-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className={cn(
                        "flex items-center p-3 rounded-md transition-all hover:bg-sidebar-accent group",
                        location.pathname === item.path && "bg-primary text-primary-foreground",
                        !isOpen && "justify-center md:justify-center"
                      )}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className={cn(
                        "ml-3 transition-all duration-300",
                        isOpen ? "opacity-100" : "opacity-0 w-0 hidden md:hidden"
                      )}>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-4">
            <Button 
              variant="ghost" 
              onClick={logout}
              className={cn(
                "w-full flex items-center p-3 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-md",
                !isOpen && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              <span className={cn(
                "ml-3 transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0 w-0 hidden md:hidden"
              )}>Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
