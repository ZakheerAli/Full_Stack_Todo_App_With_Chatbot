"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { ThemeToggle } from '../layout/ThemeToggle';
import { Button } from '../ui/button';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'border-b border-white/10 bg-background/80 backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
               <span className="text-background font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              NexaFlow
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary text-muted-foreground">Home</Link>
          <Link href="#features" className="transition-colors hover:text-primary text-muted-foreground">Features</Link>
          <Link href="#how-it-works" className="transition-colors hover:text-primary text-muted-foreground">How it Works</Link>
          <Link href="#about" className="transition-colors hover:text-primary text-muted-foreground">About</Link>
          <Link href="/contact" className="transition-colors hover:text-primary text-muted-foreground">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          <div className="h-4 w-px bg-white/10 mx-2" />
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-white">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 rounded-xl">
            <Link href="/dashboard" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl px-4 py-8 overflow-hidden"
          >
            <nav className="flex flex-col space-y-6 text-lg font-medium">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
              <Link href="#about" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                 <div className="flex justify-between items-center px-2">
                   <span className="text-muted-foreground">Language</span>
                   <LanguageSwitcher />
                 </div>
                 <Button variant="outline" asChild className="w-full justify-center h-12 rounded-xl border-white/10">
                   <Link href="/login">Sign In</Link>
                 </Button>
                 <Button asChild className="w-full justify-center h-12 rounded-xl bg-primary text-primary-foreground font-bold">
                   <Link href="/dashboard">Get Started</Link>
                 </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}