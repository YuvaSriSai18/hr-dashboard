
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<boolean>; // Mock login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Check auth status on mount
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for auth token in localStorage (mock)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    } else if (!isLoading && isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  const login = async (username: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (username === 'hr@example.com' && pass === 'password') {
      localStorage.setItem('authToken', 'mockToken');
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push('/');
      return true;
    }
    setIsAuthenticated(false);
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/login');
  };
  
  // If loading auth state, show a global loader or skeleton
  // Only render children if not on login page OR if authenticated
  // const canRenderChildren = pathname === '/login' || isAuthenticated;

  if (isLoading && pathname !== '/login' ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      { (isLoading && !isAuthenticated && pathname !== '/login') ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
