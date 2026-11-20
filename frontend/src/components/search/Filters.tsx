"use client";

import React from 'react';
import { Clock, Flag, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
export type TaskPriorityFilter = 'all' | 'high' | 'medium' | 'low';

interface FiltersProps {
  status?: TaskStatusFilter;
  priority?: TaskPriorityFilter;
  onStatusChange?: (status: TaskStatusFilter) => void;
  onPriorityChange?: (priority: TaskPriorityFilter) => void;
  onFilterChange?: (filters: { status?: string; priority?: string }) => void;
  onReset?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export function Filters({
  status = 'all',
  priority = 'all',
  onStatusChange,
  onPriorityChange,
  onFilterChange,
  onReset,
  isFiltered = false,
  className,
}: FiltersProps) {
  const handleStatusChange = (newStatus: TaskStatusFilter) => {
    onStatusChange?.(newStatus);
    onFilterChange?.({ status: newStatus === 'all' ? '' : newStatus });
  };

  const handlePriorityChange = (newPriority: TaskPriorityFilter) => {
    onPriorityChange?.(newPriority);
    onFilterChange?.({ priority: newPriority === 'all' ? '' : newPriority });
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {/* Status Filter */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Status:
        </span>
        {(['all', 'pending', 'completed'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleStatusChange(s)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all",
              status === s
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2 flex items-center gap-1">
          <Flag className="w-3 h-3" /> Priority:
        </span>
        {(['all', 'high', 'medium', 'low'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePriorityChange(p)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all",
              priority === p
                ? (p === 'high'
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : p === 'medium'
                    ? "bg-accent/20 text-accent border border-accent/40"
                    : p === 'low'
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-primary text-primary-foreground")
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Clear Filters Button */}
      {isFiltered && onReset && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
