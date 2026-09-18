"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Barbell, List, X, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";

interface NavbarProps {
  onOpenCalculator?: () => void;
}

export function Navbar({ onOpenCalculator }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Nutrition", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Athletes", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 backdrop-blur-md bg-canvas/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-[#5865f2] flex items-center justify-center text-white shadow-[0_0_15px_rgba(88,101,242,0.4)] group-hover:scale-105 transition-transform duration-200">
            <Barbell size={22} weight="bold" />
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase font-display">
            Rep<span className="text-[#5865f2]">Rise</span>
          </span>
        </Link>

        {/* Desktop Navigation Links with RandomLetterSwap */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-300">
          <a href="#features" className="hover:text-white transition-colors duration-200">
            <RandomLetterSwap
              label="Features"
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </a>
          <button
            onClick={onOpenCalculator}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <RandomLetterSwap
              label="Calculator"
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </button>
          <a href="#features" className="hover:text-white transition-colors duration-200">
            <RandomLetterSwap
              label="Nutrition"
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">
            <RandomLetterSwap
              label="Pricing"
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors duration-200">
            <RandomLetterSwap
              label="Athletes"
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </a>
          <a href="#contact" className="hover:text-white transition-colors duration-200">
            <RandomLetterSwap
              label="Contact"
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-bold tracking-wider uppercase border border-white/20 hover:border-white/40 transition-colors duration-150 cursor-pointer"
          >
            <span>LAUNCH APP</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-24 bg-surface-indigo/95 backdrop-blur-xl rounded-lg p-6 space-y-4 z-50 border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.4)]">
          <div className="flex flex-col gap-3 text-sm font-semibold text-zinc-200">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-sm hover:bg-white/10 transition-colors"
            >
              Features
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCalculator?.();
              }}
              className="text-left px-3 py-2 rounded-sm hover:bg-white/10 transition-colors text-[#35ed7e]"
            >
              Calculate My Calories
            </button>
            <a
              href="#tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-sm hover:bg-white/10 transition-colors"
            >
              Nutrition
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-sm hover:bg-white/10 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-sm hover:bg-white/10 transition-colors"
            >
              Athletes
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-sm hover:bg-white/10 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="pt-2 border-t border-white/10">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-black/60 hover:bg-black/80 text-white text-sm font-bold tracking-wider uppercase border border-white/20 hover:border-white/40 transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>LAUNCH REPRISE APP</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
