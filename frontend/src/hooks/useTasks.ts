import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../lib/api';

export interface Task {
    task_id: string;
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    due_date?: string;
}

const API_URL = API_BASE_URL;

async function fetchTasks(): Promise<Task[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log("fetchTasks: token exists?", !!token);
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/tasks/`, { headers });
    if (!res.ok) {
        console.error("fetchTasks error:", res.status, res.statusText);
        if (res.status === 401 || res.status === 403) {
            // Optional: handle logout if unauthorized
        }
        throw new Error('Failed to fetch tasks');
    }
    return res.json();
}

async function createTask(task: Partial<Task>): Promise<Task> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log("createTask: token exists?", !!token);
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(task),
    });
    if (!res.ok) {
        console.error("createTask error:", res.status);
        throw new Error('Failed to create task');
    }
    return res.json();
}

async function updateTask(task: Partial<Task> & { task_id: string }): Promise<Task> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const { task_id, ...updateData } = task;

    const res = await fetch(`${API_URL}/tasks/${task_id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData),
    });
    if (!res.ok) {
        console.error("updateTask error:", res.status);
        throw new Error('Failed to update task');
    }
    return res.json();
}

async function deleteTask(taskId: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) {
        console.error("deleteTask error:", res.status);
        throw new Error('Failed to delete task');
    }
}

export function useTasks() {
    const queryClient = useQueryClient();

    const tasksQuery = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
    });

    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueryData(['tasks']);
            queryClient.setQueryData(['tasks'], (old: any) => [
                ...(old || []),
                { ...newTask, task_id: 'temp-id-' + Date.now(), completed: false }
            ]);
            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            queryClient.setQueryData(['tasks'], context?.previousTasks);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    return {
        tasks: tasksQuery.data,
        isLoading: tasksQuery.isLoading,
        error: tasksQuery.error,
        createTask: createTaskMutation.mutate,
        updateTask: updateTaskMutation.mutate,
        deleteTask: deleteTaskMutation.mutate,
    };
}