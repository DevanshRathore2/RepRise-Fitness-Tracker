"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Barbell, List, X, ArrowRight, Sparkle, Calculator, ForkKnife, Tag, Users, EnvelopeSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface NavbarProps {
  onOpenCalculator?: () => void;
}

export function Navbar({ onOpenCalculator }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = cn(
    "group relative inline-flex h-9 w-max items-center justify-center px-1.5 py-2 font-medium text-sm transition-colors text-zinc-300 hover:text-white cursor-pointer",
    "before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:bg-[#00b0f4] before:transition-transform before:duration-300",
    "hover:before:scale-x-100",
    "focus:outline-hidden focus:before:scale-x-100",
    "hover:bg-transparent focus:bg-transparent active:bg-transparent"
  );

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

        {/* Desktop Navigation Links with NavigationMenu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-7">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navLinkClass}>
                <a href="#features" className="flex items-center gap-1.5">
                  <Sparkle size={16} className="text-[#00b0f4]" />
                  <span>Features</span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navLinkClass}>
                <button onClick={onOpenCalculator} className="flex items-center gap-1.5 cursor-pointer">
                  <Calculator size={16} className="text-[#00b0f4]" />
                  <span>Calculator</span>
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navLinkClass}>
                <a href="#features" className="flex items-center gap-1.5">
                  <ForkKnife size={16} className="text-[#00b0f4]" />
                  <span>Nutrition</span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navLinkClass}>
                <a href="#pricing" className="flex items-center gap-1.5">
                  <Tag size={16} className="text-[#00b0f4]" />
                  <span>Pricing</span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navLinkClass}>
                <a href="#testimonials" className="flex items-center gap-1.5">
                  <Users size={16} className="text-[#00b0f4]" />
                  <span>Athletes</span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navLinkClass}>
                <a href="#contact" className="flex items-center gap-1.5">
                  <EnvelopeSimple size={16} className="text-[#00b0f4]" />
                  <span>Contact</span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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
