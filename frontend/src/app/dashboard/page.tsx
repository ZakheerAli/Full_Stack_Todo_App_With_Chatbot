"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { TaskList } from "../../components/tasks/TaskList";
import { TaskForm } from "../../components/tasks/TaskForm";
import { NetworkStatus } from "../../components/ui/NetworkStatus";
import { Task } from "../../hooks/useTasks";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    console.log("Dashboard mount. Token in localStorage:", !!localStorage.getItem('token'));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
                <p className="text-muted-foreground text-lg">Manage your tasks and track your progress with <span className="text-primary font-medium">real-time sync</span>.</p>
            </div>
            <div className="bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
              <NetworkStatus />
            </div>
          </motion.div>
          
          <div className="grid gap-8 lg:grid-cols-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 xl:col-span-3 space-y-6"
            >
                <div className="sticky top-28">
                    <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-accent/20">
                      <div className="bg-card/80 backdrop-blur-xl rounded-[1.8rem] border border-white/10 p-2 shadow-2xl">
                        <TaskForm 
                            initialTask={editingTask} 
                            onCancel={() => setEditingTask(null)}
                            onSuccess={() => setEditingTask(null)}
                        />
                      </div>
                    </div>
                </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 xl:col-span-9"
            >
                <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-8 min-h-[600px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10" />
                    
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-8 bg-primary rounded-full" />
                           <h2 className="text-2xl font-bold">Your Tasks</h2>
                        </div>
                        <div className="flex gap-2">
                           <div className="h-10 w-32 bg-white/5 rounded-xl border border-white/5" /> {/* Placeholder for filters */}
                        </div>
                    </div>
                    <TaskList onEdit={setEditingTask} />
                </div>
            </motion.div>
          </div>
      </div>
    </AppLayout>
  );
}
