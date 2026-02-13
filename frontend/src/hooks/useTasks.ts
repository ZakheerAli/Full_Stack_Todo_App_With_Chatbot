import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Task {
    task_id: string;
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    due_date?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

async function fetchTasks(): Promise<Task[]> {
    const token = localStorage.getItem('token');
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
        if (res.status === 401) throw new Error('Unauthorized');
        throw new Error('Failed to fetch tasks');
    }
    return res.json();
}

async function createTask(task: Partial<Task>): Promise<Task> {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
    console.log("updateTask: token exists?", !!token);
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
    const token = localStorage.getItem('token');
    console.log("deleteTask: token exists?", !!token);
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