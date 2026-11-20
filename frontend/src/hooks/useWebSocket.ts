import { useEffect, useRef } from 'react';

export function useWebSocket(onMessage: (data: any) => void) {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // In real app, get token from authClient or cookies
        const token = "mock-token";
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000'}/ws?token=${token}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        socket.onopen = () => console.log('WebSocket connected');
        socket.onclose = () => console.log('WebSocket disconnected');

        ws.current = socket;

        return () => {
            socket.close();
        };
    }, [onMessage]);

    return ws.current;
}
