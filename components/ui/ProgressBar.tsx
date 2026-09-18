"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  unit?: string;
  color?: "brand" | "protein" | "carbs" | "fats" | "blue";
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  target,
  label,
  unit = "g",
  color = "brand",
  showPercentage = false,
  className,
}: ProgressBarProps) {
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  const colorStyles = {
    brand: "bg-[#5865f2] shadow-[0_0_12px_rgba(88,101,242,0.6)]",
    protein: "bg-[#00b0f4] shadow-[0_0_12px_rgba(0,176,244,0.6)]",
    carbs: "bg-[#35ed7e] shadow-[0_0_12px_rgba(53,237,126,0.6)]",
    fats: "bg-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.6)]",
    blue: "bg-[#5865f2] shadow-[0_0_12px_rgba(88,101,242,0.6)]",
  };

  return (
    <div className={twMerge("w-full space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="text-zinc-300 font-medium">{label}</span>}
          <div className="space-x-1 font-mono">
            <span className="text-white font-bold">{Math.round(current)}</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-400">{Math.round(target)}{unit}</span>
            {showPercentage && <span className="text-zinc-400 ml-1">({percentage}%)</span>}
          </div>
        </div>
      )}
      <div className="h-2.5 w-full bg-surface-onyx rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
