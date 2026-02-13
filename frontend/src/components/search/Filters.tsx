import React from 'react';

export function Filters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
    return (
        <div className="flex gap-4 p-4 border-b bg-gray-50">
            <select 
                onChange={(e) => onFilterChange({ status: e.target.value })}
                aria-label="Filter by status"
                className="border p-1 rounded text-sm"
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>

            <select 
                onChange={(e) => onFilterChange({ priority: e.target.value })}
                aria-label="Filter by priority"
                className="border p-1 rounded text-sm"
            >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </div>
    );
}
