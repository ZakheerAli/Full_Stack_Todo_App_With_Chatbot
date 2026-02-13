"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Sparkles } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Futuristic Graphic Placeholder */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl opacity-50" />
              <div className="relative bg-card border border-white/10 rounded-[2rem] p-10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                       <Cpu className="text-primary w-6 h-6" />
                    </div>
                    <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-white/5 rounded-full" />
                    <div className="h-3 w-4/5 bg-white/5 rounded-full" />
                    <div className="h-3 w-full bg-white/5 rounded-full" />
                  </div>
                  <div className="pt-6 grid grid-cols-2 gap-4">
                     <div className="h-32 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 flex items-center justify-center">
                        <Sparkles className="text-primary/40 w-8 h-8" />
                     </div>
                     <div className="h-32 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 flex items-center justify-center">
                        <Target className="text-accent/40 w-8 h-8" />
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Built for the <span className="text-primary">modern workflow</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                NexaFlow was born from a simple observation: most todo apps are either too simple for power users or too complex for daily tasks. 
                We&apos;ve combined professional-grade features with an intuitive interface that gets out of your way.
              </p>
              
              <div className="grid gap-8">
                <div className="flex items-start gap-6 group">
                  <div className="mt-1 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Target className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Our Mission</h4>
                    <p className="text-muted-foreground leading-relaxed">To empower individuals and teams to achieve more through organized, efficient, and stress-free workflows.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group">
                  <div className="mt-1 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Cpu className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">AI-Ready Architecture</h4>
                    <p className="text-muted-foreground leading-relaxed">Built with Phase 3 in mind, our system is ready to evolve into your personal AI task assistant, providing insights and automation.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
