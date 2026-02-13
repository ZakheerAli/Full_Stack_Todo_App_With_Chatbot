"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Settings, ListTodo, LogOut, Search, User } from 'lucide-react';
import { signOut } from '../../lib/auth-client';
import { motion } from 'framer-motion';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    { name: 'Tasks', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Saved Views', href: '/dashboard/views', icon: Search },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Background Orbs for consistent feel */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />

      <aside className="hidden w-64 border-r border-white/5 bg-card/50 backdrop-blur-xl md:flex md:flex-col relative z-20">
        <div className="flex h-20 items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
               <span className="text-background font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              NexaFlow
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="grid gap-1 px-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "" : "text-muted-foreground/60 group-hover:text-primary")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-10 px-6">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
              Saved Views
            </h4>
            <div className="grid gap-1">
              <Link href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-all group">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Today
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-all group">
                <span className="h-2 w-2 rounded-full bg-accent" />
                High Priority
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/5 p-6 bg-white/[0.02]">
          <div className="flex items-center gap-4 mb-6 px-2">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">User</p>
                <p className="text-xs text-muted-foreground truncate">Free Plan</p>
             </div>
          </div>
          <div className="flex items-center justify-between gap-2 mb-4">
             <ThemeToggle />
             <LanguageSwitcher />
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex h-16 items-center justify-between border-b border-white/5 px-6 bg-card/80 backdrop-blur-md sticky top-0 z-30">
           <Link href="/" className="flex items-center space-x-2">
             <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-background font-bold text-lg">N</span>
             </div>
             <span className="font-bold text-lg">NexaFlow</span>
           </Link>
           <div className="flex gap-2">
             <ThemeToggle />
             <LanguageSwitcher />
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}