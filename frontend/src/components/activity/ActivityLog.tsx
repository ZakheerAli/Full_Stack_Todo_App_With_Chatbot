import React from 'react';

interface ActivityLog {
    log_id: string;
    action: string;
    task_id?: string;
    created_at: string;
}

export function ActivityFeed({ logs }: { logs: ActivityLog[] }) {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Activity Audit Trail</h3>
            <div className="border rounded divide-y bg-white">
                {logs.length === 0 && <p className="p-4 text-gray-500">No activity yet.</p>}
                {logs.map((log) => (
                    <div key={log.log_id} className="p-3 text-sm">
                        <span className="font-medium text-blue-600 uppercase">{log.action.replace('.', ' ')}</span>
                        <span className="text-gray-500 ml-2">{new Date(log.created_at).toLocaleString()}</span>
                        {log.task_id && <span className="text-gray-400 block mt-1">Task ID: {log.task_id}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}
