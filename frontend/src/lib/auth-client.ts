"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";

const API_URL = API_BASE_URL;

interface User {
    user_id: string;
    email: string;
    name?: string;
}

interface Session {
    user: User;
    token: string;
}

export const authClient = {
    signIn: {
        email: async ({ email, password }: any) => {
            console.log("Attempting login to:", `${API_URL}/auth/login`);
            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!res.ok) {
                    let errorMsg = "Login failed";
                    try {
                        const error = await res.json();
                        errorMsg = error.detail || errorMsg;
                    } catch (e) {
                        errorMsg = `Server error: ${res.status}`;
                    }
                    throw new Error(errorMsg);
                }

                const data = await res.json();
                console.log("Login success, data:", data);
                
                if (data.access_token) {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', data.access_token);
                    }
                }
                return { data };
            } catch (err: any) {
                console.error("Login error:", err);
                throw err;
            }
        }
    },
    signUp: {
        email: async ({ email, password, name }: any) => {
             console.log("Attempting registration to:", `${API_URL}/auth/register`);
             try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }), 
                });

                if (!res.ok) {
                    let errorMsg = "Registration failed";
                    try {
                        const error = await res.json();
                        errorMsg = error.detail || errorMsg;
                    } catch (e) {
                        errorMsg = `Server error: ${res.status}`;
                    }
                    throw new Error(errorMsg);
                }

                const data = await res.json();
                console.log("Registration success, data:", data);

                if (data.access_token) {
                    if (typeof window !== 'undefined') {
                         localStorage.setItem('token', data.access_token);
                    }
                }
                return { data };
             } catch (err: any) {
                 console.error("Registration error:", err);
                 throw err;
             }
        }
    },
    signOut: async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
};

export const useSession = () => {
    const [data, setData] = useState<Session | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            // In a real app, we'd validate the token or fetch /me
            // For now, we just simulate a session
            setData({
                user: { user_id: "me", email: "user@example.com" }, // Placeholder
                token: token
            });
        }
        setIsPending(false);
    }, []);

    return { data, isPending, error: null };
};

export const { signIn, signUp, signOut } = authClient;
