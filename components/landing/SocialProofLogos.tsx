"use client";

import React from "react";

export function SocialProofLogos() {
  return (
    <section className="py-12 border-y border-white/10 bg-[#0a0d3a]/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-8 font-display">
          TRUSTED BY COMPETITIVE LIFTERS, ENDURANCE ATHLETES, AND COACHES WORLDWIDE
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-75 hover:opacity-100 transition-all duration-300">
          {/* Logo 1: Apex Performance */}
          <div className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current text-[#5865f2]" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-display">APEX LABS</span>
          </div>

          {/* Logo 2: Kinetic Athletics */}
          <div className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current text-[#35ed7e]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-display">KINETIC PRO</span>
          </div>

          {/* Logo 3: Iron Core Conditioning */}
          <div className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current text-[#38bdf8]" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M9 9h6v6H9z" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-display">IRON CORE</span>
          </div>

          {/* Logo 4: Vanguard Barbell */}
          <div className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current text-[#00b0f4]" viewBox="0 0 24 24">
              <path d="M3 7h18M3 17h18M7 3v18M17 3v18" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-display">VANGUARD</span>
          </div>

          {/* Logo 5: Pulse Nutrition */}
          <div className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <svg className="w-6 h-6 fill-current text-[#5865f2]" viewBox="0 0 24 24">
              <path d="M3 12h4l3-7 4 14 3-7h4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-display">PULSE PROTOCOL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
