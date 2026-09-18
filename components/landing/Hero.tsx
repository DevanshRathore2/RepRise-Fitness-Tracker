"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calculator, Lightning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ShaderBackground } from "@/components/ui/icey-night-shards";

interface HeroProps {
  onOpenCalculator: () => void;
}

export function Hero({ onOpenCalculator }: HeroProps) {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic WebGL Shader Canvas (Icey Night Shards in shades of blue) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="w-full h-full opacity-85" />
        {/* Subtle gradient wash to melt bottom edge and protect headline text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d3a]/20 via-transparent to-[#0a0d3a] pointer-events-none" />
      </div>

      {/* Background Discord Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#5865f2]/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Center-Aligned Content Stack (matching reference aesthetic) */}
      <div className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5865f2]/15 border border-[#5865f2]/30 text-white text-xs font-bold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(88,101,242,0.25)] backdrop-blur-md">
          <Lightning size={14} weight="fill" className="text-[#35ed7e]" />
          <span>CALIBRATED FITNESS INTELLIGENCE</span>
        </div>

        {/* Display Headline - Centered, Sentence/Title Case with Period */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6 font-display">
          Calibrate Your Diet. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c7ccfa] to-[#5865f2]">
            Master Your Physique.
          </span>
        </h1>

        {/* Centered Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Precision macro tracking, calibrated daily calorie targets, and progressive strength logs built for athletes seeking tangible physical progression.
        </p>

        {/* Centered Action Row with Pill Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <ShinyButton className="!py-3.5 !px-8 text-sm font-bold tracking-wide">
              <span>Start Tracking</span>
              <ArrowUpRight size={18} weight="bold" />
            </ShinyButton>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={onOpenCalculator}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border-white/20 hover:border-[#5865f2] hover:bg-surface-indigo/80 gap-2 text-sm font-semibold backdrop-blur-sm"
          >
            <Calculator size={18} weight="bold" className="text-[#00b0f4]" />
            <span>Calculate Calories</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
