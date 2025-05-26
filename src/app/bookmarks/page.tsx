
"use client";

import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCard } from '@/components/dashboard/UserCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookmarkPlus } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BookmarksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { users, bookmarks, isLoadingUsers } = useApp();

  const bookmarkedUsers = users.filter(user => bookmarks.includes(user.id));

  if (authLoading || isLoadingUsers) {
    return (
      <DashboardLayout>
        <div className="space-y-4 p-4">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Bookmarked Employees</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
               <div key={i} className="space-y-3 p-4 border rounded-xl shadow bg-card">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-[150px] bg-muted animate-pulse" />
                    <div className="h-4 w-[100px] bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-full bg-muted animate-pulse" />
                <div className="h-4 w-3/4 bg-muted animate-pulse" />
                <div className="h-8 w-1/2 bg-muted animate-pulse" />
                <div className="flex justify-between gap-2 pt-2">
                  <div className="h-9 w-1/3 bg-muted animate-pulse" />
                  <div className="h-9 w-1/3 bg-muted animate-pulse" />
                  <div className="h-9 w-1/3 bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Bookmarked Employees</h1>
      {bookmarkedUsers.length === 0 ? (
        <Alert className="max-w-lg mx-auto text-center">
          <BookmarkPlus className="h-6 w-6 mx-auto mb-2 text-primary" />
          <AlertTitle className="text-xl">No Bookmarked Employees Yet</AlertTitle>
          <AlertDescription className="mb-4">
            You haven&apos;t bookmarked any employees. Start by browsing the dashboard and marking your key team members.
          </AlertDescription>
          <Button asChild>
            <Link href="/">Browse Dashboard</Link>
          </Button>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkedUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
