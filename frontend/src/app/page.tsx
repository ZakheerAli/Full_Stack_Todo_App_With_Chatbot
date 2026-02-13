"use client";

import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { SocialProof } from "../components/landing/SocialProof";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { About } from "../components/landing/About";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

import { motion } from "framer-motion";

export default function LandingPage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <SocialProof />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <Features />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <HowItWorks />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <About />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <CTA />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}