"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Check, Star } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  href: string;
  popular: boolean;
}

const PLANS: Plan[] = [
  {
    id: "tier-core",
    name: "CORE TRACKING",
    priceMonthly: 0,
    priceAnnual: 0,
    period: "month",
    description: "Essential macro and calorie tracking for disciplined lifters getting started.",
    features: [
      "Calibrated daily calorie & macro targets",
      "Food diary (Breakfast, Lunch, Dinner, Snacks)",
      "Standard food database search & quick log",
      "Body weight moving average tracking",
      "Basic workout session logging",
      "RepRise athlete community access",
    ],
    buttonText: "START FOR FREE",
    href: "/dashboard",
    popular: false,
  },
  {
    id: "tier-pro",
    name: "PRO ATHLETE",
    priceMonthly: 15,
    priceAnnual: 12,
    period: "month",
    description: "Adaptive intelligence and strength progression built for dedicated lifters.",
    features: [
      "Everything in Core Tracking",
      "Dynamic adaptive weekly calorie adjustments",
      "Water retention weight-smoothing algorithms",
      "Unlimited custom recipes & meal templates",
      "Progressive overload workout logs & 1RM calculator",
      "Detailed micronutrient & fiber analytics",
      "Priority customer & technical support",
    ],
    buttonText: "START 14-DAY TRIAL",
    href: "/dashboard",
    popular: true,
  },
  {
    id: "tier-elite",
    name: "ELITE PROTOCOL",
    priceMonthly: 39,
    priceAnnual: 29,
    period: "month",
    description: "Full-scale competitive coaching and peak week optimization.",
    features: [
      "Everything in Pro Athlete",
      "1-on-1 certified nutrition coach check-ins",
      "Personalized training periodization mesocycles",
      "Custom peak week carbohydrate depletion/loading",
      "Direct coach messaging channel",
      "Bi-weekly physique photo & data audit",
      "Guaranteed response within 4 hours",
    ],
    buttonText: "JOIN ELITE PROTOCOL",
    href: "/dashboard",
    popular: false,
  },
];

export function Pricing() {
  const [isMonthly, setIsMonthly] = useState(false); // Default to Annual for best conversion
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);

    // Trigger celebratory confetti when toggling into Annual billing
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 65,
        spread: 65,
        origin: { x, y },
        colors: ["#5865f2", "#00b0f4", "#35ed7e", "#38bdf8"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#5865f2]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865f2]/20 border border-[#5865f2]/30 text-[#00b0f4] text-xs font-bold uppercase tracking-wider mb-4 font-display">
          <span>MEMBERSHIP TIERS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase font-display">
          ENGINEERED FOR SERIOUS INTENT
        </h2>
        <p className="text-base text-zinc-300 leading-relaxed max-w-xl mx-auto font-normal">
          Simple, transparent pricing. No hidden fees or lock-in contracts. Unlock the complete calibrated nutrition and strength suite.
        </p>

        {/* Interactive Billing Switch with Confetti */}
        <div className="mt-8 inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-surface-indigo/80 border border-white/15 backdrop-blur-md shadow-md">
          <span className={cn("text-xs font-bold tracking-wider transition-colors", isMonthly ? "text-white" : "text-zinc-400")}>
            MONTHLY
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <Label className="sr-only">Toggle Annual Billing</Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-[#5865f2] data-[state=unchecked]:bg-surface-onyx"
            />
          </label>
          <span className={cn("text-xs font-bold tracking-wider flex items-center gap-1.5 transition-colors", !isMonthly ? "text-white" : "text-zinc-400")}>
            <span>ANNUAL</span>
            <span className="px-2 py-0.5 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] font-mono font-bold tracking-normal">
              SAVE 20%
            </span>
          </span>
        </div>
      </div>

      {/* 3D Perspective Spring Animated Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {PLANS.map((plan, index) => {
          const currentPrice = isMonthly ? plan.priceMonthly : plan.priceAnnual;

          return (
            <motion.div
              key={plan.id}
              initial={{ y: 50, opacity: 1 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.popular ? -18 : 0,
                      opacity: 1,
                      x: index === 2 ? -24 : index === 0 ? 24 : 0,
                      scale: index === 0 || index === 2 ? 0.96 : 1.0,
                    }
                  : {}
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.4,
                type: "spring",
                stiffness: 100,
                damping: 26,
                delay: 0.2,
                opacity: { duration: 0.4 },
              }}
              className={cn(
                "rounded-2xl p-8 text-center flex flex-col justify-between relative transition-all duration-300",
                plan.popular
                  ? "bg-surface-indigo border-2 border-[#5865f2] shadow-[0_0_50px_rgba(88,101,242,0.35)] z-20"
                  : "bg-surface-indigo/60 border border-white/15 hover:border-white/30 z-10",
                !plan.popular && "md:mt-4",
                index === 0 && "origin-right",
                index === 2 && "origin-left"
              )}
            >
              {/* Popular Corner Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00b0f4] text-black py-1 px-4 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,176,244,0.5)] z-30">
                  <Star size={13} weight="fill" className="text-black" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider font-display">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex-1 flex flex-col">
                {/* Plan Header */}
                <div className="text-left mb-6">
                  <h3 className="text-2xl font-black text-white uppercase font-display tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed min-h-[34px]">
                    {plan.description}
                  </p>
                </div>

                {/* Animated Numeric Price */}
                <div className="text-left mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
                      <NumberFlow
                        value={currentPrice}
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        transformTiming={{
                          duration: 450,
                          easing: "ease-out",
                        }}
                        willChange
                      />
                    </span>
                    <span className="text-sm font-semibold text-zinc-400">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    {currentPrice === 0
                      ? "Free forever • No card required"
                      : isMonthly
                      ? "Billed monthly"
                      : `Billed annually ($${currentPrice * 12}/year)`}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 text-left mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-200">
                      <div className="w-4 h-4 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} weight="bold" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <Link
                    href={plan.href}
                    className={cn(
                      "w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md select-none",
                      plan.popular
                        ? "bg-[#5865f2] text-white hover:bg-[#4752c4] shadow-[0_0_25px_rgba(88,101,242,0.45)] hover:scale-[1.02]"
                        : "bg-surface-onyx text-white border border-white/20 hover:border-[#5865f2] hover:bg-surface-indigo/90"
                    )}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
