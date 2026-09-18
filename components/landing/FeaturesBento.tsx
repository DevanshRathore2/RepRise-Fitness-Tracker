"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ForkKnife,
  TrendUp,
  Barbell,
  ChartPieSlice,
  CheckCircle,
  Fire,
  MagnifyingGlass,
  ArrowUpRight,
  Star,
} from "@phosphor-icons/react";

interface FeaturesBentoProps {
  onOpenCalculator?: () => void;
}

export function FeaturesBento({ onOpenCalculator }: FeaturesBentoProps) {
  return (
    <section id="features" className="relative py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Ambient Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#5865f2]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Centered Headline & Subtitle (Picture 1 style) */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase font-display">
          Precision Nutrition.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] via-[#00b0f4] to-[#38bdf8]">
            Engineered Results.
          </span>
        </h2>
        <p className="text-base text-zinc-300 leading-relaxed font-normal max-w-2xl mx-auto">
          Empowering your physique with next-generation fitness tracking. From calibrated macro targets to progressive workout overload, we engineer your daily fitness success.
        </p>
      </div>

      {/* 6-Card Feature Grid (3 columns x 2 rows, matching Picture 1 format) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Intuitive Food & Meal Tracking (Featuring the REAL stock image) */}
        <div className="rounded-2xl bg-[#0f1330]/90 border border-white/10 hover:border-[#00b0f4]/40 hover:bg-[#13183d] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-onyx border border-white/10 flex items-center justify-center text-[#00b0f4] shadow-[0_0_12px_rgba(0,176,244,0.25)] group-hover:scale-105 transition-transform">
                <ForkKnife size={20} weight="bold" />
              </div>
              <Link
                href="/tracker"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Open food tracker"
              >
                <ArrowUpRight size={15} weight="bold" />
              </Link>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight uppercase">
              Intuitive Food & Meal Tracking
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
              Search hundreds of verified whole foods, adjust serving portions in seconds, and log meals across Breakfast, Lunch, Dinner, and Snacks.
            </p>
          </div>

          {/* Real Stock Photography Embed */}
          <div className="relative h-44 w-full rounded-xl overflow-hidden border border-white/10 mt-auto group-hover:border-[#00b0f4]/50 transition-all duration-300 shadow-inner">
            <Image
              src="/images/meal_prep.jpg"
              alt="Real high protein meal prep bowl with grilled chicken, avocado, greens, and quinoa"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d3a]/90 via-[#0a0d3a]/20 to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 bg-surface-indigo/90 backdrop-blur-md border border-white/15 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#35ed7e] animate-pulse" />
                <span className="font-bold text-white uppercase font-display text-[10px]">Real Food Diary</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-[#00b0f4] font-bold">48g P</span>
                <span className="text-[#35ed7e] font-bold">52g C</span>
                <span className="text-[#38bdf8] font-bold">14g F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Gram-Precision Macros */}
        <div className="rounded-2xl bg-[#0f1330]/90 border border-white/10 hover:border-[#00b0f4]/40 hover:bg-[#13183d] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-onyx border border-white/10 flex items-center justify-center text-[#00b0f4] shadow-[0_0_12px_rgba(0,176,244,0.25)] group-hover:scale-105 transition-transform">
                <ChartPieSlice size={20} weight="bold" />
              </div>
              <button
                onClick={onOpenCalculator}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Calculate macros"
              >
                <ArrowUpRight size={15} weight="bold" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight uppercase">
              Gram-Precision Macros
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
              Never guess your nutrient split again. Automatic target calculations tailored to your lean body mass and athletic goals.
            </p>
          </div>

          {/* Macro Visual HUD */}
          <div className="space-y-3 p-4 rounded-xl bg-surface-onyx/90 border border-white/10 mt-auto">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00b0f4]" />
                  <span className="text-[#00b0f4]">Protein</span> (Target: 175g)
                </span>
                <span className="font-mono text-white">148g logged</span>
              </div>
              <div className="h-2 w-full bg-surface-indigo rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00b0f4] rounded-full shadow-[0_0_8px_rgba(0,176,244,0.6)]"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#35ed7e]" />
                  <span className="text-[#35ed7e]">Carbs</span> (Target: 220g)
                </span>
                <span className="font-mono text-white">195g logged</span>
              </div>
              <div className="h-2 w-full bg-surface-indigo rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#35ed7e] rounded-full shadow-[0_0_8px_rgba(53,237,126,0.6)]"
                  style={{ width: "88%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  <span className="text-[#38bdf8]">Healthy Fats</span> (Target: 62g)
                </span>
                <span className="font-mono text-white">54g logged</span>
              </div>
              <div className="h-2 w-full bg-surface-indigo rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38bdf8] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                  style={{ width: "87%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Strength & Workout Tracker */}
        <div className="rounded-2xl bg-[#0f1330]/90 border border-white/10 hover:border-[#5865f2]/40 hover:bg-[#13183d] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-onyx border border-white/10 flex items-center justify-center text-[#5865f2] shadow-[0_0_12px_rgba(88,101,242,0.25)] group-hover:scale-105 transition-transform">
                <Barbell size={20} weight="bold" />
              </div>
              <Link
                href="/workouts"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Open workout tracker"
              >
                <ArrowUpRight size={15} weight="bold" />
              </Link>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight uppercase">
              Strength & Workout Tracker
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
              Log sets, reps, weight lifted, and rest timers. Automatically track progressive overload and personal records across major lifts.
            </p>
          </div>

          {/* Exercise Set HUD */}
          <div className="p-3.5 rounded-xl bg-surface-onyx/90 border border-white/10 space-y-2 font-mono text-xs mt-auto">
            <div className="flex items-center justify-between text-zinc-400 pb-1.5 border-b border-white/10 font-display text-[10px] font-bold uppercase tracking-wider">
              <span className="text-white">Barbell Bench Press</span>
              <span className="text-[#35ed7e] font-extrabold">NEW PR: 110 KG</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2.5 rounded bg-surface-indigo/70 border border-white/5 text-[11px]">
              <span className="text-zinc-300">Set 1</span>
              <span className="text-white font-bold">95 kg x 8 reps</span>
              <CheckCircle size={15} weight="fill" className="text-[#35ed7e]" />
            </div>
            <div className="flex items-center justify-between py-1 px-2.5 rounded bg-surface-indigo/70 border border-white/5 text-[11px]">
              <span className="text-zinc-300">Set 2</span>
              <span className="text-white font-bold">95 kg x 8 reps</span>
              <CheckCircle size={15} weight="fill" className="text-[#35ed7e]" />
            </div>
          </div>
        </div>

        {/* Card 4: Body Composition Analytics */}
        <div className="rounded-2xl bg-[#0f1330]/90 border border-white/10 hover:border-[#35ed7e]/40 hover:bg-[#13183d] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-onyx border border-white/10 flex items-center justify-center text-[#35ed7e] shadow-[0_0_12px_rgba(53,237,126,0.25)] group-hover:scale-105 transition-transform">
                <TrendUp size={20} weight="bold" />
              </div>
              <Link
                href="/progress"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Open progress tracking"
              >
                <ArrowUpRight size={15} weight="bold" />
              </Link>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight uppercase">
              Body Composition Analytics
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
              Track daily weigh-ins with moving averages to filter out water fluctuations and view true fat loss trajectories over time.
            </p>
          </div>

          {/* Weigh-in HUD */}
          <div className="p-3.5 rounded-xl bg-surface-onyx/90 border border-white/10 mt-auto">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-surface-indigo">
                <span className="text-[9px] uppercase text-zinc-400 font-bold font-display">Start</span>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">84.8 kg</div>
              </div>
              <div className="p-2 rounded bg-[#5865f2]/20 border border-[#5865f2]/40">
                <span className="text-[9px] uppercase text-[#7983f5] font-bold font-display">Current</span>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">82.4 kg</div>
              </div>
              <div className="p-2 rounded bg-surface-indigo">
                <span className="text-[9px] uppercase text-zinc-400 font-bold font-display">Target</span>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">78.0 kg</div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-400 px-1">
              <span>Overall Trend</span>
              <span className="text-[#35ed7e] font-mono font-bold">35% toward target</span>
            </div>
          </div>
        </div>

        {/* Card 5: Adaptive Calorie Engine */}
        <div className="rounded-2xl bg-[#0f1330]/90 border border-white/10 hover:border-[#00b0f4]/40 hover:bg-[#13183d] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-onyx border border-white/10 flex items-center justify-center text-[#00b0f4] shadow-[0_0_12px_rgba(0,176,244,0.25)] group-hover:scale-105 transition-transform">
                <Fire size={20} weight="bold" />
              </div>
              <button
                onClick={onOpenCalculator}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Open calorie engine calculator"
              >
                <ArrowUpRight size={15} weight="bold" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight uppercase">
              Adaptive Calorie Engine
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
              Our intelligent metabolic algorithm continuously recalculates your caloric expenditure as your body weight shifts.
            </p>
          </div>

          {/* Calorie Engine Calculation HUD */}
          <div className="p-3.5 rounded-xl bg-surface-onyx/90 border border-white/10 space-y-2 mt-auto font-mono text-xs">
            <div className="flex justify-between items-center text-[11px] pb-1.5 border-b border-white/10">
              <span className="text-zinc-400">BMR Baseline</span>
              <span className="text-white font-bold">1,820 kcal</span>
            </div>
            <div className="flex justify-between items-center text-[11px] pb-1.5 border-b border-white/10">
              <span className="text-zinc-400">Active TDEE</span>
              <span className="text-[#00b0f4] font-bold">2,480 kcal</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300 font-semibold">Recommended Target</span>
              <span className="text-[#35ed7e] font-extrabold">2,050 kcal/day</span>
            </div>
          </div>
        </div>

        {/* Card 6: Verified Whole-Food Database */}
        <div className="rounded-2xl bg-[#0f1330]/90 border border-white/10 hover:border-[#38bdf8]/40 hover:bg-[#13183d] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-onyx border border-white/10 flex items-center justify-center text-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:scale-105 transition-transform">
                <MagnifyingGlass size={20} weight="bold" />
              </div>
              <Link
                href="/tracker"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Search food database"
              >
                <ArrowUpRight size={15} weight="bold" />
              </Link>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight uppercase">
              Verified Whole-Food Library
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
              Access an ad-free, verified nutritional database of single-ingredient whole foods with instant macro splits and portion sizing.
            </p>
          </div>

          {/* Food Library Search HUD */}
          <div className="p-3.5 rounded-xl bg-surface-onyx/90 border border-white/10 space-y-2 mt-auto">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface-indigo/80 border border-white/10 text-xs">
              <MagnifyingGlass size={13} className="text-[#38bdf8]" />
              <span className="text-zinc-200 text-[11px] truncate">Grilled Chicken Breast, Cooked</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono px-1 text-zinc-400">
              <span>150g · 247 kcal</span>
              <span className="text-[#00b0f4] font-bold">46g P · 0g C · 5g F</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
