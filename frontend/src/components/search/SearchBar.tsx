import React, { useState } from 'react';

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
    const [query, setQuery] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full border p-2 pl-10 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
            </div>
        </div>
    );
}
