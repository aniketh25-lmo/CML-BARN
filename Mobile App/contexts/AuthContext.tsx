import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<boolean>;
  signup: (name: string, phoneNumber: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  isOTPSent: boolean;
  pendingPhoneNumber: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (phoneNumber: string): Promise<boolean> => {
    try {
      // For demo purposes, we'll simulate checking if user exists
      // In a real app, this would be an API call
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const existingUser = users.find((u: User) => u.phoneNumber === phoneNumber);
      
      if (existingUser) {
        // User exists, simulate OTP sending
        setPendingPhoneNumber(phoneNumber);
        setIsOTPSent(true);
        return true;
      } else {
        // For demo purposes, let's create a default user if none exists
        const defaultUser: User = {
          id: Date.now().toString(),
          name: 'Demo User',
          phoneNumber: phoneNumber,
          createdAt: new Date().toISOString(),
        };

        // Save to users list
        const updatedUsers = [...users, defaultUser];
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

        // Set pending for OTP verification
        setPendingPhoneNumber(phoneNumber);
        setIsOTPSent(true);
        return true;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const signup = async (name: string, phoneNumber: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const existingUser = users.find((u: User) => u.phoneNumber === phoneNumber);
      
      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        phoneNumber,
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Set pending for OTP verification
      setPendingPhoneNumber(phoneNumber);
      setIsOTPSent(true);
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6 && pendingPhoneNumber) {
        const existingUsers = await AsyncStorage.getItem('users');
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        
        const user = users.find((u: User) => u.phoneNumber === pendingPhoneNumber);
        
        if (user) {
          await saveUser(user);
          setIsOTPSent(false);
          setPendingPhoneNumber(null);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsOTPSent(false);
      setPendingPhoneNumber(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    verifyOTP,
    isOTPSent,
    pendingPhoneNumber,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}