"use client";

import React from "react";

interface RepRiseLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export function RepRiseLogo({
  className = "",
  iconOnly = false,
  size = "md",
  animated = true,
}: RepRiseLogoProps) {
  // Dimension scaling
  const sizeMap = {
    sm: { width: 130, height: 38, iconSize: 32, fontSize: 22 },
    md: { width: 165, height: 48, iconSize: 40, fontSize: 27 },
    lg: { width: 210, height: 60, iconSize: 50, fontSize: 34 },
    xl: { width: 280, height: 80, iconSize: 66, fontSize: 45 },
  };

  const current = sizeMap[size];

  if (iconOnly) {
    return (
      <div
        className={`relative inline-flex items-center justify-center group select-none ${className}`}
        style={{ width: current.iconSize, height: current.iconSize }}
      >
        {/* Luminous Glow Halo */}
        <div className="absolute inset-0 bg-[#00b0f4]/25 rounded-xl blur-[8px] group-hover:bg-[#00b0f4]/45 group-hover:blur-[12px] transition-all duration-300 pointer-events-none" />

        {/* Compact Comet Icon Tile */}
        <div className="relative w-full h-full rounded-xl bg-[#0a0e27] border border-white/15 group-hover:border-[#00b0f4]/50 flex items-center justify-center overflow-hidden transition-all duration-300">
          <svg
            viewBox="0 0 100 100"
            className={`w-[85%] h-[85%] transition-transform duration-300 ${
              animated ? "group-hover:scale-110" : ""
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cometIconGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00b0f4" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <filter id="iconStarGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Diagonal Soaring Comet Star & Trail */}
            <g filter="url(#iconStarGlow)">
              <path
                d="
                  M 12,82
                  L 64,36
                  Q 68,26 71,8
                  Q 74,27 94,30
                  Q 75,34 73,52
                  Q 69,38 60,42
                  L 12,82
                  Z
                "
                fill="url(#cometIconGrad)"
              />
              <circle cx="73" cy="30" r="2.5" fill="#ffffff" />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  // Full COMET-Style Brand Lockup (Bold Geometric Wordmark + Soaring Comet Star)
  return (
    <div
      className={`inline-flex items-center group select-none cursor-pointer ${className}`}
      style={{ width: current.width, height: current.height }}
    >
      <svg
        viewBox="0 0 240 68"
        className={`w-full h-full overflow-visible transition-transform duration-300 ${
          animated ? "group-hover:scale-[1.02]" : ""
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Luminous Comet Streak Gradient: Electric Cyan -> Sky Blue -> Radiant White */}
          <linearGradient id="cometTailGradFull" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b0f4" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#00b0f4" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Star Flare Glow */}
          <filter id="starBloomGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="bloom" />
            <feComposite in="SourceGraphic" in2="bloom" operator="over" />
          </filter>
        </defs>

        {/* 
          1. THE COMET STREAK & 4-POINTED STAR:
          Shooting upward-right across the top of the wordmark and blooming into the razor-sharp 4-pointed star flare
        */}
        <g filter="url(#starBloomGlow)">
          <path
            d="
              M 82,24
              L 194,13
              Q 201,8 205,-2
              Q 208,9 224,11
              Q 209,14 207,26
              Q 202,16 191,15.5
              L 82,24
              Z
            "
            fill="url(#cometTailGradFull)"
          />

          {/* Glowing Star Core */}
          <circle cx="206" cy="11.5" r="2.5" fill="#ffffff" />
        </g>

        {/* 
          2. THE COMET-STYLE GEOMETRIC WORDMARK:
          Bold, modern, high-impact athletic lettering: REPRISE
        */}
        <g className="font-display">
          <text
            x="0"
            y="60"
            fill="#ffffff"
            className="font-black tracking-tight"
            style={{
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: "44px",
              fontWeight: 900,
              letterSpacing: "-0.035em",
            }}
          >
            REP<tspan fill="#00b0f4">RISE</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}
