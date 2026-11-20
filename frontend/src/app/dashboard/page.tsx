"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { TaskList } from "../../components/tasks/TaskList";
import { TaskForm } from "../../components/tasks/TaskForm";
import { NetworkStatus } from "../../components/ui/NetworkStatus";
import { useTasks, Task } from "../../hooks/useTasks";
import { SearchBar } from "../../components/search/SearchBar";
import { Filters, TaskStatusFilter, TaskPriorityFilter } from "../../components/search/Filters";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>("all");

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log("Dashboard mount. Token in localStorage:", !!token);
    if (!token) {
        console.warn("No token found, redirecting to login");
        router.push('/login');
    }
  }, [router]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      // Search matching (title and description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title?.toLowerCase().includes(query) ?? false;
        const matchesDesc = task.description?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // Status matching
      if (statusFilter === "pending" && task.completed) {
        return false;
      }
      if (statusFilter === "completed" && !task.completed) {
        return false;
      }

      // Priority matching
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const isFiltered = Boolean(
    searchQuery.trim() || statusFilter !== "all" || priorityFilter !== "all"
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

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
                    
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-8 bg-primary rounded-full" />
                               <h2 className="text-2xl font-bold">Your Tasks</h2>
                               {tasks && tasks.length > 0 && (
                                 <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                                   {isFiltered ? `${filteredTasks.length} of ${tasks.length}` : tasks.length}
                                 </span>
                               )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                            <div className="flex-1 max-w-md">
                                <SearchBar 
                                  value={searchQuery}
                                  onChange={setSearchQuery}
                                  onClear={() => setSearchQuery("")}
                                />
                            </div>
                            <Filters 
                              status={statusFilter}
                              priority={priorityFilter}
                              onStatusChange={setStatusFilter}
                              onPriorityChange={setPriorityFilter}
                              onReset={handleResetFilters}
                              isFiltered={isFiltered}
                            />
                        </div>
                    </div>

                    <TaskList 
                      tasks={filteredTasks}
                      allTasksCount={tasks?.length ?? 0}
                      isFiltered={isFiltered}
                      onResetFilters={handleResetFilters}
                      onEdit={setEditingTask} 
                    />
                </div>
            </motion.div>
          </div>
      </div>
    </AppLayout>
  );
}
