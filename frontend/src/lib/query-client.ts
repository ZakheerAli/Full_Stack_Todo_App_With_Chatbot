import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: (failureCount, error: any) => {
                if (error?.message?.includes('401') || error?.message?.includes('403')) return false;
                return failureCount < 3;
            }
        },
    },
});

export function handleWebSocketMessage(data: any) {
    const { event, task, task_id } = data;

    if (event === 'task.created') {
        queryClient.setQueryData(['tasks'], (old: any) => [...(old || []), task]);
    } else if (event === 'task.updated') {
        queryClient.setQueryData(['tasks'], (old: any) => 
            old?.map((t: any) => t.task_id === task.task_id ? task : t)
        );
    } else if (event === 'task.deleted') {
        queryClient.setQueryData(['tasks'], (old: any) => 
            old?.filter((t: any) => t.task_id !== task_id)
        );
    }
}
