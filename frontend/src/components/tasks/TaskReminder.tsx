"use client";

import React, { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Task } from '../../hooks/useTasks';

export function TaskReminder({ tasks }: { tasks: Task[] }) {
    const { sendNotification, requestPermission } = useNotifications();

    useEffect(() => {
        // Request permission on mount if needed
        requestPermission();
    }, [requestPermission]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            tasks.forEach(task => {
                if (task.due_date && !task.completed) {
                    const dueDate = new Date(task.due_date);
                    // Notify if task is due within the next minute
                    const diff = dueDate.getTime() - now.getTime();
                    if (diff > 0 && diff < 60000) {
                        sendNotification(`Task Due Soon: ${task.title}`, {
                            body: task.description || 'Your task is approaching its deadline.',
                        });
                    }
                }
            });
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [tasks, sendNotification]);

    return null; // Logic-only component
}
