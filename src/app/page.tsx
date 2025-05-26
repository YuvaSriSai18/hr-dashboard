
"use client";

import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCard } from '@/components/dashboard/UserCard';
import { SearchFilterControls } from '@/components/dashboard/SearchFilterControls';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ITEMS_PER_PAGE = 12;

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { filteredUsers, isLoadingUsers, fetchUsers } = useApp();
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const loadMoreItems = () => {
    setVisibleItems(prev => prev + ITEMS_PER_PAGE);
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 p-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    // AuthProvider should handle redirect, this is a fallback or for initial render before redirect
    return null; 
  }
  
  return (
    <DashboardLayout>
      <SearchFilterControls />
      {isLoadingUsers && filteredUsers.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-xl shadow">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <div className="flex justify-between gap-2 pt-2">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-9 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Alert className="mt-6">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>No Users Found</AlertTitle>
          <AlertDescription>
            No users match your current search criteria, or there was an issue fetching data. Try adjusting your filters or <Button variant="link" className="p-0 h-auto" onClick={fetchUsers}>refreshing the data</Button>.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.slice(0, visibleItems).map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          {visibleItems < filteredUsers.length && (
            <div className="mt-8 text-center">
              <Button onClick={loadMoreItems} size="lg">
                Load More Employees
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
