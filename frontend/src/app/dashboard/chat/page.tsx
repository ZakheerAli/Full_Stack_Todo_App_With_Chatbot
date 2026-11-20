'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Plus, MessageSquare, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { API_BASE_URL } from '@/lib/api';

interface Message {
  message_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  conversation_id: string;
  updated_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchConversations = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].conversation_id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [activeConversationId]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchConversations();
  }, [router, fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Optimistic update
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      message_id: tempId,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: activeConversationId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const data = await response.json();
      
      if (!activeConversationId) {
        setActiveConversationId(data.conversation_id);
        fetchConversations();
      }

      setMessages(prev => [...prev, {
        message_id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString()
      }]);

      // Invalidate tasks query to update tasks list instantly in the UI
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        message_id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I couldn't reach the server right now. Please check your connection and try again.",
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">AI Chat Assistant</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Use natural language to add, update, complete, or delete your tasks. Your task list will sync in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)]">
          {/* Left panel: Chat Container (sidebar + chat view) */}
          <div className="lg:col-span-8 flex bg-card border rounded-2xl overflow-hidden shadow-xl">
            {/* Sidebar */}
            <div className="w-56 border-r bg-muted/20 flex flex-col hidden md:flex">
              <div className="p-3 border-b">
                <Button onClick={createNewConversation} className="w-full justify-start gap-2 text-xs" variant="outline">
                  <Plus className="w-3.5 h-3.5" />
                  New Chat
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.conversation_id}
                    onClick={() => setActiveConversationId(conv.conversation_id)}
                    className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-center gap-2.5 ${
                      activeConversationId === conv.conversation_id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <div className="truncate text-xs font-semibold">
                      {new Date(conv.updated_at).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 flex flex-col bg-background/20 backdrop-blur-md">
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <Bot className="w-12 h-12 opacity-25 text-primary animate-pulse" />
                    <p className="text-sm font-medium">Ask me to manage your tasks!</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-md">
                      {[
                        'Add task: Buy groceries tomorrow',
                        'Show my pending tasks',
                        "What's due tomorrow?",
                        'Complete my grocery task'
                      ].map((hint) => (
                        <button
                          key={hint}
                          onClick={() => setInput(hint)}
                          className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full border transition-colors"
                        >
                          &quot;{hint}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.message_id}
                      className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted/80 border text-foreground rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted border">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-muted/80 border rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Thinking &amp; syncing tasks...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-card/50">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={input}
                    disabled={isLoading}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "NexaFlow AI is processing..." : "Ask NexaFlow AI to manage tasks..."}
                    className="w-full bg-background border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-opacity hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right panel: Live Tasks View (visible on desktop) */}
          <div className="lg:col-span-4 flex flex-col bg-card border border-white/5 rounded-2xl p-4 shadow-xl overflow-hidden min-h-[400px]">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
              <div className="w-1.5 h-5 bg-primary rounded-full" />
              <h2 className="text-lg font-bold">Live Task Feed</h2>
            </div>
            <div className="flex-1 overflow-y-auto mt-4 pr-1">
              <TaskList onEdit={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
