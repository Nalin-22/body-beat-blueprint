
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Calculator, 
  LogOut, 
  Menu, 
  Dumbbell, 
  History, 
  Apple
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
  SidebarFooter
} from "@/components/ui/sidebar";

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
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <h2 className="font-bold text-xl">FitTrack</h2>
            <div className="flex-1" />
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <SidebarMenuButton
              onClick={logout}
              className="w-full text-red-500 hover:bg-red-100 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default SideMenu;
