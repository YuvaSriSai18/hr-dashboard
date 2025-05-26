"use client";
import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Home,
  Bookmark,
  BarChart2,
  LogOut,
  Sun,
  Moon,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { getInitials } from "@/lib/utils";
import { CreateUserModal } from "@/components/dashboard/CreateUserModal";
import React from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] =
    React.useState(false);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-primary"
            >
              <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.026A.75.75 0 003 6.695V18.75a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V6.695a.75.75 0 00-.366-.669L12.378 1.602zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
            </svg>
            <h1 className="text-xl font-semibold text-foreground">
              HR Glimpse
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={false} tooltip="Dashboard">
                <Link href="/">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={false} tooltip="Bookmarks">
                <Link href="/bookmarks">
                  <Bookmark />
                  <span>Bookmarks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={false} tooltip="Analytics">
                <Link href="/analytics">
                  <BarChart2 />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsCreateUserModalOpen(true)}
                tooltip="Create User"
              >
                <UserPlus />
                <span>Create User</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" /> {/* Only show on mobile */}
            <h2 className="text-lg font-semibold">Employee Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Avatar>
              <AvatarImage
                src="https://t3.ftcdn.net/jpg/09/48/09/30/360_F_948093078_6kRWXnAWFNEaakRMX5OM9CRNNj2gdIfw.jpg"
                alt="HR Manager"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>{getInitials("HR", "Manager")}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </SidebarInset>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onOpenChange={setIsCreateUserModalOpen}
      />
    </SidebarProvider>
  );
}
