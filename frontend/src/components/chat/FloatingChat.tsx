'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Plus, MessageSquare, Loader2, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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

export function FloatingChat() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "mb-4 w-80 md:w-96 bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl",
              isMinimized ? "h-auto" : "h-[500px]"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">NexaFlow AI</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">Always active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-white"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center space-y-4 px-8">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 opacity-20" />
                      </div>
                      <p className="text-xs font-medium">I&apos;m your AI Todo assistant. How can I help you organize your day?</p>
                      <div className="grid grid-cols-1 gap-2 w-full">
                        {[
                          'Add task: Buy groceries tomorrow',
                          'Show my pending tasks',
                          "What's due tomorrow?"
                        ].map((hint) => (
                          <button
                            key={hint}
                            onClick={() => setInput(hint)}
                            className="px-3 py-2 text-[10px] bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors text-left"
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
                        className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`p-1.5 rounded-full flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-muted border border-white/10'}`}>
                          {msg.role === 'user' ? <User className="w-3 h-3 text-background" /> : <Bot className="w-3 h-3 text-white" />}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-primary text-background font-medium rounded-tr-none' 
                            : 'bg-muted/80 border border-white/5 text-white rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 rounded-full bg-muted border border-white/10">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-muted/80 border border-white/5 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        <span className="text-[10px] text-muted-foreground">Thinking &amp; syncing...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-card/80">
                  <form onSubmit={handleSendMessage} className="relative">
                    <input
                      type="text"
                      value={input}
                      disabled={isLoading}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isLoading ? "Processing..." : "Ask NexaFlow AI..."}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-background rounded-lg disabled:opacity-50 transition-opacity hover:scale-105 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (!token) {
            router.push('/login');
            return;
          }
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 border border-white/20 transition-all",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 text-background" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-primary" />
        </div>
      </motion.button>
    </div>
  );
}
