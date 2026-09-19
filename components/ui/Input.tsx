"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              "h-11 px-4 rounded-xl bg-[#0c1033]/90 hover:bg-[#0f1544]/90 focus:bg-[#11174d] border border-white/15 hover:border-white/30 focus:border-[#5865f2] text-white text-sm font-medium placeholder:text-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] focus:shadow-[0_0_20px_rgba(88,101,242,0.3)] disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              error && "border-red-500/60 focus:border-red-500 focus:ring-red-500",
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        {!error && helperText && <p className="text-xs text-zinc-400 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
