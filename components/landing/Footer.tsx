"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Barbell, ArrowRight, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-white/10 bg-canvas pt-16 pb-12 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10 relative z-10">
        {/* Brand Column */}
        <div className="md:col-span-4 text-left space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#5865f2] flex items-center justify-center text-white shadow-[0_0_15px_rgba(88,101,242,0.5)]">
              <Barbell size={22} weight="bold" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white font-display">
              REP<span className="text-[#5865f2]">RISE</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-sm font-normal">
            The modern standard for calibrated calorie tracking, macro distribution, and progressive strength logs. Built for peak physical progression.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            PLATFORM
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-300 font-medium">
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Food Diary
              </Link>
            </li>
            <li>
              <Link href="/tracker" className="hover:text-white transition-colors">
                Food Database
              </Link>
            </li>
            <li>
              <Link href="/progress" className="hover:text-white transition-colors">
                Weight Analytics
              </Link>
            </li>
            <li>
              <Link href="/workouts" className="hover:text-white transition-colors">
                Workout Tracker
              </Link>
            </li>
          </ul>
        </div>

        {/* Scientific Foundations */}
        <div className="md:col-span-2 text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            SCIENCE
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-300 font-medium">
            <li>
              <span className="hover:text-white transition-colors">Adaptive Calorie Engine</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors">Adaptive TDEE Multipliers</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors">Lean Mass Protein Density</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors">Progressive Overload RPE</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-4 text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            ATHLETIC NUTRITION DIGEST
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            Monthly evidence-based nutrition guides, macro formulas, and training routines.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-[#35ed7e] text-xs py-2 font-semibold">
              <Check size={16} weight="bold" />
              <span>Subscribed to monthly research updates.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                aria-label="Email for nutrition digest"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3.5 rounded-sm bg-surface-indigo border border-white/10 text-xs text-white placeholder:text-zinc-400 flex-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Button type="submit" size="sm" variant="primary" className="uppercase font-bold">
                <span>JOIN</span>
                <ArrowRight size={14} weight="bold" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Text Hover Effect Wordmark */}
      <div className="max-w-7xl mx-auto pt-4 relative z-20">
        <div className="w-full h-36 sm:h-52 md:h-72 flex items-center justify-center -my-4 sm:-my-8">
          <TextHoverEffect text="REPRISE" className="z-30 w-full max-w-5xl" />
        </div>
      </div>

      <FooterBackgroundGradient />

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <div>
          &copy; {new Date().getFullYear()} RepRise Performance Inc. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            Data Isolation
          </a>
        </div>
      </div>
    </footer>
  );
}
