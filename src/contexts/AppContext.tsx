
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User, Department, DummyUser } from '@/types';
import { transformDummyUserToUser } from '@/lib/utils'; // Removed getRandomDepartment as it's not used here directly

type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoadingUsers: boolean;
  fetchUsers: () => Promise<void>;
  findUserById: (id: number) => User | undefined;
  updateUser: (updatedUser: User) => void;
  addUser: (newUserFields: Omit<User, 'id'>) => void; // Changed to Omit<User, 'id'>
  
  bookmarks: number[]; // Array of user IDs
  addBookmark: (userId: number) => void;
  removeBookmark: (userId: number) => void;
  isBookmarked: (userId: number) => boolean;
  
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  departmentFilter: Department[];
  setDepartmentFilter: React.Dispatch<React.SetStateAction<Department[]>>;
  ratingFilter: number[];
  setRatingFilter: React.Dispatch<React.SetStateAction<number[]>>;
  
  filteredUsers: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<Department[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number[]>([]);


  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('https://dummyjson.com/users?limit=50&skip=0');
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Fetched data is not in the expected format (missing or invalid 'users' array).");
      }
      const transformedUsers = data.users.map((du: DummyUser) => transformDummyUserToUser(du));
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]); // Clear users on error
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const storedBookmarks = localStorage.getItem('hrGlimpseBookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, [fetchUsers]);

  const findUserById = useCallback((id: number): User | undefined => {
    return users.find(user => user.id === id);
  }, [users]);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
  }, []);
  
  const addUser = useCallback((newUserFields: Omit<User, 'id'>) => {
    let newId: number;
    if (users.length === 0) {
      newId = 1;
    } else {
      const maxId = Math.max(...users.map(u => u.id));
      // Handle case where users might be empty after map if all IDs were non-numeric (highly unlikely with current setup)
      // or if Math.max on an empty array returned -Infinity
      newId = (maxId === -Infinity ? 0 : maxId) + 1;
    }
    const userWithId: User = { ...newUserFields, id: newId };
    setUsers(prevUsers => [userWithId, ...prevUsers]);
  }, [users]);


  const addBookmark = (userId: number) => {
    setBookmarks(prev => {
      const newBookmarks = [...new Set([...prev, userId])];
      localStorage.setItem('hrGlimpseBookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const removeBookmark = (userId: number) => {
    setBookmarks(prev => {
      const newBookmarks = prev.filter(id => id !== userId);
      localStorage.setItem('hrGlimpseBookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isBookmarked = (userId: number): boolean => {
    return bookmarks.includes(userId);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = searchTerm.toLowerCase() === '' ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.department.toLowerCase().includes(searchTerm.toLowerCase());

      const departmentMatch = departmentFilter.length === 0 ||
        departmentFilter.includes(user.company.department);
      
      const ratingMatch = ratingFilter.length === 0 ||
        ratingFilter.includes(Math.floor(user.performanceRating));

      return searchMatch && departmentMatch && ratingMatch;
    });
  }, [users, searchTerm, departmentFilter, ratingFilter]);


  return (
    <AppContext.Provider value={{
      users, setUsers, isLoadingUsers, fetchUsers, findUserById, updateUser, addUser,
      bookmarks, addBookmark, removeBookmark, isBookmarked,
      searchTerm, setSearchTerm,
      departmentFilter, setDepartmentFilter,
      ratingFilter, setRatingFilter,
      filteredUsers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
