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
              "h-11 px-3.5 rounded-lg bg-[#070b24]/80 border border-white/15 text-white text-sm placeholder:text-zinc-400 transition-all focus:outline-none focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/20 hover:border-white/25 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner",
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
