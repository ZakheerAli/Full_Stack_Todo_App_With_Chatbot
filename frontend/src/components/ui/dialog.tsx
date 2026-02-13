"use client";

import React from 'react';

// NOTE: In production, use @radix-ui/react-dialog for robust focus trapping and accessibility.
// This is a simplified placeholder structure.

export function Dialog({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded"
                    aria-label="Close dialog"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}
