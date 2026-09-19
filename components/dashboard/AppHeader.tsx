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
import { Show, UserButton } from "@clerk/nextjs";
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
      <div className="max-w-7xl mx-auto h-12 flex items-center justify-between">
        {/* Left: Brand & Home Link */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-xl bg-[#5865f2] flex items-center justify-center text-white shadow-[0_0_12px_rgba(88,101,242,0.4)] group-hover:scale-105 transition-transform">
              <Barbell size={15} weight="bold" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white font-display hidden sm:inline">
              REP<span className="text-[#5865f2]">RISE</span>
            </span>
          </Link>

          {/* Desktop Nav Items - Compact Discord pill style with icons */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-[#5865f2] text-white shadow-[0_0_14px_rgba(88,101,242,0.4)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon size={14} weight={isActive ? "fill" : "bold"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick actions, Auth & Recalibrate */}
        <div className="flex items-center gap-2">
          {onOpenOnboarding && (
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="h-7 px-3 rounded-full border border-white/20 hover:border-white/40 text-[11px] font-mono font-bold text-white flex items-center gap-1.5 transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal size={13} weight="bold" />
              <span className="hidden sm:inline">RECALIBRATE</span>
            </button>
          )}

          <Show when="signed-in">
            <div className="flex items-center ml-0.5">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-7 h-7 ring-2 ring-[#5865f2]/40 rounded-full",
                  },
                }}
              />
            </div>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="h-7 px-3 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-[11px] font-mono font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(88,101,242,0.3)] cursor-pointer"
            >
              SIGN IN
            </Link>
          </Show>

          <Link
            href="/"
            className="h-7 px-2.5 rounded-full text-[11px] font-mono font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={13} weight="bold" />
            <span className="hidden sm:inline">EXIT APP</span>
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
