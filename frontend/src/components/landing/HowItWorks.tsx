"use client";

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Create an Account',
    description: 'Sign up in seconds with your email and password. No complex setups or long forms.',
  },
  {
    number: '02',
    title: 'Organize Your Tasks',
    description: 'Add tasks, set priorities, and assign due dates. Use tags to categorize your work.',
  },
  {
    number: '03',
    title: 'Sync and Collaborate',
    description: 'Access your tasks from any device. Everything is synced in real-time for your convenience.',
  },
  {
    number: '04',
    title: 'Track Your Progress',
    description: 'Complete tasks, view your activity history, and celebrate your wins.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">How <span className="text-accent">NexaFlow</span> Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A simple, effective flow designed to boost your daily productivity without the friction.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical line with gradient */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-transparent md:-translate-x-1/2" />
          
          <div className="space-y-20 md:space-y-32">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number} 
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 w-full pl-16 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md ml-0 md:ml-auto mr-0 md:mr-auto">
                    {step.description}
                  </p>
                </div>
                
                <div className="absolute left-0 md:relative md:left-auto z-10 w-12 h-12 rounded-xl bg-background border-2 border-primary/50 flex items-center justify-center font-bold text-primary shadow-[0_0_20px_rgba(0,191,165,0.2)]">
                  {step.number}
                </div>
                
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
