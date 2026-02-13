"use client";

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'framer-motion';
import { 
  Zap, 
  WifiOff, 
  Globe, 
  Search, 
  Accessibility, 
  History 
} from 'lucide-react';

const features = [
  {
    title: 'Real-Time Synchronization',
    description: 'Instant updates across all your devices. Your tasks stay in sync whether you are on desktop, tablet, or mobile.',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'Offline-First Reliability',
    description: 'Work anywhere, even without internet. Your changes are saved locally and synced automatically when you are back online.',
    icon: WifiOff,
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  {
    title: 'Urdu & RTL Support',
    description: 'Native support for Urdu with right-to-left layout. Switch languages seamlessly with a single click.',
    icon: Globe,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'Advanced Search & Filters',
    description: 'Find exactly what you need with powerful full-text search and customizable filtering options.',
    icon: Search,
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  {
    title: 'WCAG 2.1 Accessibility',
    description: 'Designed for everyone. Full keyboard navigation and screen reader support out of the box.',
    icon: Accessibility,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'Activity Audit Trail',
    description: 'Track every change. See the history of your tasks and stay accountable with detailed activity logs.',
    icon: History,
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Everything you need to <span className="text-primary">stay productive</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience a modern todo application that actually works the way you do. 
            Fast, reliable, and accessible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                  <CardContent className="p-10">
                    <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}