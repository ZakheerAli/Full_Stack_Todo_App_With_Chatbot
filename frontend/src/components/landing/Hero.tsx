"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Animated Orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-hero-glow blur-[120px] -z-10 animate-pulse-glow" />
      
      {/* CSS Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent 1px),linear-gradient(to_bottom,#ffffff05_1px,transparent 1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="container mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Built for Focus Today. Ready for Intelligence Tomorrow.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Organize your work <br />
            <span className="text-primary">at the speed of thought</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience the next generation of productivity. Real-time sync, offline-first reliability, 
            and full Urdu/RTL support, designed for the AI-driven future.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            <Button 
              size="lg" 
              asChild 
              className="h-14 px-10 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(182,255,59,0.3)] hover:shadow-[0_0_35px_rgba(182,255,59,0.5)]"
            >
              <Link href="/dashboard" className="gap-2">
                Start Building Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="h-14 px-10 text-lg font-semibold border-white/10 hover:bg-white/5 transition-all"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-ping" />
             No credit card required. Enterprise-ready.
          </p>
        </motion.div>

        {/* Mockup Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 relative group max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
          <div className="relative rounded-2xl border border-white/10 bg-card aspect-[16/9] overflow-hidden shadow-2xl flex">
             {/* Sidebar Mock */}
             <div className="w-1/4 border-r border-white/5 bg-white/[0.02] p-6 hidden md:flex flex-col gap-6">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-4 pt-4">
                   <div className="h-2 w-full bg-primary/20 rounded" />
                   <div className="h-2 w-2/3 bg-white/5 rounded" />
                   <div className="h-2 w-3/4 bg-white/5 rounded" />
                </div>
                <div className="mt-auto space-y-4">
                   <div className="h-8 w-full bg-white/5 rounded-lg" />
                   <div className="h-8 w-full bg-white/5 rounded-lg" />
                </div>
             </div>
             
             {/* Main Content Mock */}
             <div className="flex-1 p-8 bg-background/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl" />
                
                <div className="flex justify-between items-center mb-8">
                   <div className="h-6 w-32 bg-white/10 rounded" />
                   <div className="h-8 w-8 bg-white/10 rounded-full" />
                </div>
                
                <div className="space-y-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.03] flex items-center gap-4">
                        <div className="w-5 h-5 rounded-lg border border-white/20" />
                        <div className="flex-1 space-y-2">
                           <div className={`h-2 ${i === 1 ? 'w-1/2' : 'w-1/3'} bg-white/20 rounded`} />
                           <div className="h-2 w-1/4 bg-white/5 rounded" />
                        </div>
                        <div className={`w-12 h-4 rounded-full ${i === 1 ? 'bg-red-500/20' : 'bg-primary/20'}`} />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}