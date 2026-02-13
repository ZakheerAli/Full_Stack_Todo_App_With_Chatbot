"use client";

import React, { useState, useEffect } from 'react';
import { useTasks, Task } from '../../hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Plus, Calendar, Flag, Save, X, AlertCircle, Edit2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/toast';

interface TaskFormProps {
  initialTask?: Task | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function TaskForm({ initialTask, onCancel, onSuccess }: TaskFormProps) {
  const { createTask, updateTask } = useTasks();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setDueDate(initialTask.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    let formattedDate = undefined;
    if (dueDate) {
        try {
            formattedDate = new Date(dueDate).toISOString();
        } catch (err) {
            console.error("Invalid date:", dueDate);
        }
    }

    const taskData = {
        title, 
        description, 
        priority,
        due_date: formattedDate
    };

    if (initialTask) {
      updateTask({ 
        task_id: initialTask.task_id,
        ...taskData,
        completed: initialTask.completed
      }, {
        onSuccess: () => {
             toast('Task updated', 'success');
             onSuccess?.();
        },
        onError: () => toast('Failed to update task', 'error')
      });
    } else {
      createTask({ 
        ...taskData,
        completed: false 
      }, {
        onSuccess: () => {
            toast('Task created', 'success');
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDueDate('');
            onSuccess?.();
        },
        onError: () => toast('Failed to create task', 'error')
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="text-primary w-5 h-5" />
         </div>
         <h2 className="text-xl font-bold">{initialTask ? 'Refine Task' : 'Quick Capture'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Title</Label>
          <Input 
              id="title"
              placeholder="E.g. Design system review" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/40 text-lg font-medium placeholder:text-muted-foreground/30 transition-all"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="desc" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Description</Label>
          <Textarea 
              id="desc"
              placeholder="Add some context..." 
              rows={4} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/40 placeholder:text-muted-foreground/30 resize-none transition-all p-4"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <Label htmlFor="priority" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Flag className="h-3.5 w-3.5" /> Priority Level
            </Label>
            <div className="grid grid-cols-3 gap-2">
               {(['low', 'medium', 'high'] as const).map((p) => (
                 <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "h-10 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all",
                      priority === p 
                        ? (p === 'high' ? "bg-red-500/20 border-red-500 text-red-400" : p === 'medium' ? "bg-accent/20 border-accent text-accent" : "bg-primary/20 border-primary text-primary")
                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                 >
                   {p}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="duedate" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Deadline
            </Label>
            <Input 
              id="duedate"
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white/5 border-white/10 h-11 rounded-xl focus:border-primary/40 transition-all" 
            />
          </div>
        </div>
        
        <div className="pt-4 flex flex-col gap-3">
          <Button type="submit" className="h-14 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 gap-2">
              {initialTask ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {initialTask ? 'Save Changes' : 'Create Task'}
          </Button>
          {initialTask && (
              <Button type="button" variant="outline" onClick={onCancel} className="h-12 rounded-2xl border-white/10 hover:bg-white/5 transition-all">
                  <X className="h-4 w-4" /> Cancel
              </Button>
          )}
        </div>
      </form>
    </div>
  );
}