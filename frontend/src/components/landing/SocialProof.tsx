"use client";

import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Pydantic AI', icon: '🤖' },
  { name: 'FastAPI', icon: '⚡' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Vercel', icon: '☁️' },
  { name: 'Neon', icon: '💎' },
];

export function SocialProof() {
  return (
    <section className="bg-background py-16 border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-10"
        >
          Powered by the stack of the future
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20">
          {logos.map((logo, index) => (
            <motion.div 
              key={logo.name} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3 grayscale hover:grayscale-0 cursor-default transition-all"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span className="text-xl font-bold text-white/80">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
