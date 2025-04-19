
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Calculator, 
  LogOut,
  Dumbbell, 
  History, 
  Apple
} from 'lucide-react';

const menuItems = [
  { 
    title: 'Home', 
    icon: Home, 
    path: '/dashboard'
  },
  { 
    title: 'Workout Plans', 
    icon: Dumbbell, 
    path: '/dashboard/workout-plans'
  },
  { 
    title: 'Workout History', 
    icon: History, 
    path: '/dashboard/workout-history'
  },
  { 
    title: 'Calorie Counter', 
    icon: Apple, 
    path: '/dashboard/calorie-counter'
  },
  { 
    title: 'BMI Calculator', 
    icon: Calculator, 
    path: '/dashboard/bmi-calculator'
  }
];

const SideMenu = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold">FitTrack</h2>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
