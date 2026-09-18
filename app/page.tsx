"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { ContactForm } from "@/components/landing/ContactForm";
import { Footer } from "@/components/landing/Footer";
import { CalorieCalculatorModal } from "@/components/landing/CalorieCalculatorModal";
import { TechStackBanner } from "@/components/landing/TechStackBanner";

export default function LandingPage() {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <main className="min-h-screen bg-canvas text-ink discord-mesh-canvas overflow-x-hidden w-full max-w-full">
      {/* Navigation */}
      <Navbar onOpenCalculator={() => setCalculatorOpen(true)} />

      {/* Hero Section */}
      <Hero onOpenCalculator={() => setCalculatorOpen(true)} />

      {/* Full-width sliding Tech Stack Banner right over the bottom of the Icey Shader with Frosted Glass Blur */}
      <div className="relative -mt-16 z-30 w-full">
        <TechStackBanner />
      </div>

      {/* Seamless Transition: multi-stop ease-in dissolve from Hero shader into page body */}
      <div
        className="relative -mt-32 h-48 w-full pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 13, 58, 0) 0%, rgba(10, 13, 58, 0.4) 30%, rgba(10, 13, 58, 0.85) 75%, rgba(10, 13, 58, 1) 100%)",
        }}
      />

      {/* Features Bento */}
      <FeaturesBento onOpenCalculator={() => setCalculatorOpen(true)} />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Plans */}
      <Pricing />

      {/* Contact & Inquiry */}
      <ContactForm />

      {/* Footer */}
      <Footer />

      {/* Interactive Calorie Calculator Dialog */}
      <CalorieCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
    </main>
  );
}
