
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper to save user data to localStorage
const saveUserToStorage = (user: User) => {
  localStorage.setItem('fittrackUser', JSON.stringify(user));
};

// Helper to remove user data from localStorage
const removeUserFromStorage = () => {
  localStorage.removeItem('fittrackUser');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('fittrackUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app with backend, we'd validate with an API
      // For now, simulate validation with some basic checks
      if (!email || !password) {
        toast.error('Please provide both email and password');
        return false;
      }
      
      // Simulate successful login after validation
      const userData: User = { email };
      setUser(userData);
      saveUserToStorage(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate input data
      if (!email || !password) {
        toast.error('Please provide all required fields');
        return false;
      }
      
      // Check for existing users (would be done on the backend in a real app)
      const existingUsers = localStorage.getItem('fittrackUsers');
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.some((u: User) => u.email === email);
      if (userExists) {
        toast.error('An account with this email already exists');
        return false;
      }
      
      // Create new user
      const newUser: User = { email, name };
      users.push(newUser);
      localStorage.setItem('fittrackUsers', JSON.stringify(users));
      
      // Log in the user after successful registration
      setUser(newUser);
      saveUserToStorage(newUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeUserFromStorage();
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
