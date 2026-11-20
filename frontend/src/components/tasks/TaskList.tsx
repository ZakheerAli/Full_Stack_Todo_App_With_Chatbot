"use client";

import React from 'react';
import { TaskCard, Task } from './TaskCard';
import { useTasks } from '../../hooks/useTasks';
import { SearchX, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '../ui/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface TaskListProps {
  tasks?: Task[];
  allTasksCount?: number;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onEdit?: (task: Task) => void;
}

export function TaskList({ 
  tasks: propTasks, 
  allTasksCount, 
  isFiltered, 
  onResetFilters, 
  onEdit 
}: TaskListProps) {
  const { tasks: queryTasks, isLoading, error, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();

  const activeTasks = propTasks ?? queryTasks ?? [];
  const totalCount = allTasksCount ?? (queryTasks?.length ?? 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/[0.03] border border-white/5 rounded-[1.5rem] animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-12 text-center border-2 border-dashed rounded-[2rem] border-destructive/20 bg-destructive/5 text-destructive"
      >
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
           <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">Sync Error</h3>
        <p className="opacity-80 max-w-xs mx-auto mb-6">We couldn&apos;t reach the focus servers. Check your connection.</p>
        <Button variant="outline" className="border-destructive/20 hover:bg-destructive/10 rounded-xl" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (totalCount === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-16 text-center border-2 border-dashed rounded-[2.5rem] border-white/5 bg-white/[0.02]"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Clear Horizons</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-lg leading-relaxed">
          Your focus list is empty. Take a moment to breathe, then capture your next big goal.
        </p>
      </motion.div>
    );
  }

  if (activeTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-16 text-center border-2 border-dashed rounded-[2.5rem] border-white/5 bg-white/[0.02]"
      >
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted-foreground">
          <SearchX className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Matching Tasks</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-base leading-relaxed mb-6">
          No tasks matched your search or active filters.
        </p>
        {onResetFilters && (
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="border-white/10 hover:bg-white/5 rounded-xl text-sm"
          >
            Reset Filters
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      <AnimatePresence mode="popLayout">
        {activeTasks.map((task) => (
          <TaskCard 
            key={task.task_id} 
            task={task} 
            onToggleComplete={(id) => updateTask(
              { task_id: id, completed: !task.completed },
              {
                  onSuccess: () => toast(task.completed ? 'Focus continued' : 'Goal achieved!', 'success'),
                  onError: () => toast('Failed to update sync', 'error')
              }
            )}
            onDelete={(id) => deleteTask(id, {
               onSuccess: () => toast('Task released', 'success'),
               onError: () => toast('Failed to delete', 'error')
            })}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
