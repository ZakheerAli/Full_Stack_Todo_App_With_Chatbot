"use client";

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, Circle, Clock, Edit2, Trash2, AlertCircle, CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface Task {
  task_id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  due_date?: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-l-red-400', icon: AlertCircle },
  medium: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-l-accent', icon: Circle },
  low: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-l-primary', icon: Circle },
};

export function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) {
  const config = priorityConfig[task.priority] || priorityConfig.medium;
  const PriorityIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 border border-white/5 border-l-4",
        config.border,
        task.completed ? "bg-white/[0.02] opacity-60" : "bg-white/[0.04] backdrop-blur-sm"
      )}>
        <CardContent className="p-6 flex items-start gap-5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "mt-1 h-7 w-7 rounded-xl p-0 transition-all active:scale-90",
              task.completed ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10 border border-white/10"
            )}
            onClick={() => onToggleComplete?.(task.task_id)}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className={cn(
                "font-bold text-xl leading-snug break-words tracking-tight",
                task.completed && "text-muted-foreground line-through decoration-muted-foreground/50"
              )}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-white/5"
                  onClick={() => onEdit?.(task)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/10"
                  onClick={() => onDelete?.(task.task_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {task.description && (
              <p className={cn(
                "text-base text-muted-foreground line-clamp-2 leading-relaxed",
                task.completed && "opacity-70"
              )}>
                {task.description}
              </p>
            )}
            
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm",
                config.bg, config.color
              )}>
                <PriorityIcon className="h-3.5 w-3.5" />
                <span>{task.priority}</span>
              </div>
              
              {task.due_date && (
                <div className="flex items-center gap-2 text-muted-foreground bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
                  <CalendarDays className="h-3.5 w-3.5 text-primary/60" />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}