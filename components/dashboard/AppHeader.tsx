"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Barbell,
  ForkKnife,
  TrendUp,
  SlidersHorizontal,
  ArrowLeft,
  SquaresFour,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onOpenOnboarding?: () => void;
}

export function AppHeader({ onOpenOnboarding }: AppHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: SquaresFour },
    { label: "Food Diary", href: "/tracker", icon: ForkKnife },
    { label: "Weight & Progress", href: "/progress", icon: TrendUp },
    { label: "Workout Tracker", href: "/workouts", icon: Barbell },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0a0d3a]/90 backdrop-blur-md px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        {/* Left: Brand & Home Link */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#5865f2] flex items-center justify-center text-white shadow-[0_0_16px_rgba(88,101,242,0.45)] group-hover:scale-105 transition-transform">
              <Barbell size={19} weight="bold" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white font-display hidden sm:inline">
              REP<span className="text-[#5865f2]">RISE</span>
            </span>
          </Link>

          {/* Desktop Nav Items - Discord pill style with icons */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#5865f2] text-white shadow-[0_0_18px_rgba(88,101,242,0.45)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon size={17} weight={isActive ? "fill" : "bold"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick actions & Recalibrate */}
        <div className="flex items-center gap-2.5">
          {onOpenOnboarding && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenOnboarding}
              className="text-xs gap-1.5"
            >
              <SlidersHorizontal size={14} weight="bold" />
              <span className="hidden sm:inline">RECALIBRATE</span>
            </Button>
          )}

          <Link href="/">
            <Button size="sm" variant="ghost" className="text-xs text-zinc-300 hover:text-white">
              <ArrowLeft size={14} weight="bold" />
              <span className="hidden sm:inline">EXIT APP</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-sm text-xs flex flex-col items-center gap-1 transition-all ${isActive ? "text-[#5865f2] font-bold" : "text-zinc-400 hover:text-white"
                }`}
            >
              <Icon size={18} weight={isActive ? "fill" : "bold"} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
