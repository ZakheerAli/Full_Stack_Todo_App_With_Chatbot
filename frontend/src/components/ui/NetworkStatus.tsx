"use client";

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {!isOnline ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 right-8 bg-destructive/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center gap-3 z-50 border border-white/20"
                >
                    <WifiOff className="h-5 w-5 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Offline Mode</span>
                        <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Syncing Paused</span>
                    </div>
                </motion.div>
            ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] uppercase font-bold tracking-[0.2em] text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Real-time Sync Active</span>
                </div>
            )}
        </AnimatePresence>
    );
}
