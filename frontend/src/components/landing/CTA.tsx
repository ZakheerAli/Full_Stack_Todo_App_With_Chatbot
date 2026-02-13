"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-card border border-white/10 py-20 px-8 text-center shadow-2xl"
        >
          {/* Background Glows */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
              Ready to <span className="text-primary">supercharge</span> your <br className="hidden md:block" /> productivity?
            </h2>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              Join thousands of users who have transformed their workflow with NexaFlow. 
              Start for free today and experience the future of task management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/register" 
                className="group w-full sm:w-auto px-12 py-5 bg-accent text-accent-foreground font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(182,255,59,0.2)] hover:shadow-[0_0_50px_rgba(182,255,59,0.4)] flex items-center justify-center gap-2 text-lg"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-12 py-5 bg-white/5 text-white font-semibold border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md text-lg"
              >
                Schedule a Demo
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground/60">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
