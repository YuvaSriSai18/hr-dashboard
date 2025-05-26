
"use client"; // Recharts requires client components

import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DepartmentRatingsChart } from '@/components/analytics/DepartmentRatingsChart';
import { BookmarkTrendsChart } from '../../components/analytics/BookmarkTrendChart';
import type { Department, DepartmentAverageRating, BookmarkTrend } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to calculate average ratings per department
const calculateDepartmentAverageRatings = (users: import('@/types').User[]): DepartmentAverageRating[] => {
  const departmentRatings: Record<string, { totalRating: number; count: number }> = {};

  users.forEach(user => {
    const dept = user.company.department;
    if (!departmentRatings[dept]) {
      departmentRatings[dept] = { totalRating: 0, count: 0 };
    }
    departmentRatings[dept].totalRating += user.performanceRating;
    departmentRatings[dept].count += 1;
  });

  return Object.entries(departmentRatings).map(([department, data]) => ({
    department: department as Department,
    averageRating: data.count > 0 ? parseFloat((data.totalRating / data.count).toFixed(2)) : 0,
  })).sort((a,b) => b.averageRating - a.averageRating);
};

// Mock data for bookmark trends
const getMockBookmarkTrends = (): BookmarkTrend[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    bookmarks: Math.floor(Math.random() * 30) + 10 + index * 2, // Increasing trend
  }));
};

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { users, isLoadingUsers } = useApp();

  const [departmentRatingsData, setDepartmentRatingsData] = useState<DepartmentAverageRating[]>([]);
  const [bookmarkTrendsData, setBookmarkTrendsData] = useState<BookmarkTrend[]>([]);

  useEffect(() => {
    if (users.length > 0) {
      setDepartmentRatingsData(calculateDepartmentAverageRatings(users));
      setBookmarkTrendsData(getMockBookmarkTrends());
    }
  }, [users]);

  if (authLoading || isLoadingUsers) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-4">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Performance Analytics</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[450px] w-full rounded-lg" />
            <Skeleton className="h-[450px] w-full rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Performance Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DepartmentRatingsChart data={departmentRatingsData} />
        <BookmarkTrendsChart data={bookmarkTrendsData} />
      </div>
    </DashboardLayout>
  );
}
