"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Send, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -z-10" />
      
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
               <Sparkles className="h-4 w-4" />
               <span>We are here to help</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
              Get in touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions about NexaFlow? We are here to help you supercharge your productivity and build the future of focus.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-8"
            >
              <Card className="border-white/10 bg-primary text-background rounded-[2.5rem] p-4 shadow-2xl shadow-primary/20">
                <CardHeader className="pt-10 px-8">
                  <CardTitle className="text-3xl font-bold">Contact Info</CardTitle>
                  <CardDescription className="text-background/70 text-lg">
                    Our team typically responds within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-10 px-8 pb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-background/10 rounded-2xl flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Email</p>
                      <p className="text-lg font-bold">support@nexaflow.ai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-background/10 rounded-2xl flex items-center justify-center">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Phone</p>
                      <p className="text-lg font-bold">+1 (555) 000-0000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-background/10 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Live Chat</p>
                      <p className="text-lg font-bold">Mon-Fri, 9am-5pm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-8"
            >
              <Card className="border-white/10 bg-card/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                <CardContent className="p-10 md:p-16">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <Send className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                      <p className="text-muted-foreground text-lg mb-12">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                      <Button 
                        size="lg" 
                        onClick={() => setIsSubmitted(false)}
                        className="rounded-xl px-10 h-14 bg-primary text-primary-foreground font-bold"
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            required 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/40 transition-all px-6 text-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            required 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/40 transition-all px-6 text-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?" 
                          required 
                          className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/40 transition-all px-6 text-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Type your message here..." 
                          rows={6} 
                          required 
                          className="bg-white/5 border-white/10 rounded-2xl focus:border-primary/40 transition-all p-6 text-lg resize-none"
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full md:w-auto h-14 px-12 rounded-2xl bg-accent text-accent-foreground font-bold hover:scale-[1.02] transition-all shadow-lg shadow-accent/20 gap-3 text-lg">
                        <Send className="h-5 w-5" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}