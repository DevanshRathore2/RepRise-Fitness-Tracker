"use client";

import React from "react";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";

const TECH_STACK = [
  {
    name: "Next.js 15",
    category: "Framework",
    icon: (
      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.836 18.064l-6.84-9.395V17.5H9.5V6.5h1.75l6.98 9.61V6.5h1.5v11.564h-1.894z" />
      </svg>
    ),
  },
  {
    name: "React 19",
    category: "UI Library",
    icon: (
      <svg className="w-5 h-5 text-[#00b0f4]" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" />
        <g stroke="currentColor" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    category: "Strict Typing",
    icon: (
      <svg className="w-5 h-5 text-[#38bdf8] fill-current" viewBox="0 0 24 24">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM11.5 14.75h-2v4.5H7.75v-4.5h-2v-1.5h5.75v1.5zm8.25-1.25c0 .75-.3 1.35-.9 1.8-.6.45-1.4.7-2.4.75-1.15.05-2.1-.2-2.8-.7l.8-1.3c.6.4 1.3.6 2 .6.6 0 1-.1 1.3-.3.2-.2.3-.4.3-.7 0-.3-.1-.5-.3-.7-.2-.2-.6-.4-1.2-.6-.9-.3-1.6-.7-2-1.1-.4-.4-.6-1-.6-1.7 0-.7.3-1.3.8-1.7.5-.4 1.2-.7 2.1-.7 1 0 1.8.2 2.5.6l-.7 1.3c-.6-.4-1.2-.5-1.8-.5-.5 0-.9.1-1.2.3-.2.2-.3.4-.3.6 0 .3.1.5.3.7.2.2.6.4 1.2.6.9.3 1.6.7 2 1.1.4.4.5 1 .5 1.7z" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    category: "Styling Engine",
    icon: (
      <svg className="w-5 h-5 text-[#38bdf8] fill-current" viewBox="0 0 24 24">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    category: "Relational DB",
    icon: (
      <svg className="w-5 h-5 text-[#5865f2] fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    name: "Prisma ORM",
    category: "Data Modeling",
    icon: (
      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12.636 1.157a1.5 1.5 0 00-2.316.512L3.197 16.574a1.5 1.5 0 00.916 2.052l9.043 3.618a1.5 1.5 0 001.996-.902l6.732-17.75a1.5 1.5 0 00-1.89-1.925l-7.358 2.49zM12 4.385l4.896 1.66-4.664 12.302-6.27-2.508L12 4.385z" />
      </svg>
    ),
  },
  {
    name: "shadcn/ui",
    category: "Design System",
    icon: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 256 256" fill="none">
        <line x1="208" y1="128" x2="128" y2="208" stroke="currentColor" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="192" y1="40" x2="40" y2="192" stroke="currentColor" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Phosphor Icons",
    category: "Iconography",
    icon: (
      <svg className="w-5 h-5 text-[#35ed7e]" viewBox="0 0 256 256" fill="none">
        <rect width="256" height="256" rx="60" fill="#35ed7e" fillOpacity="0.2" />
        <circle cx="128" cy="128" r="48" stroke="#35ed7e" strokeWidth="24" />
        <line x1="128" y1="176" x2="128" y2="224" stroke="#35ed7e" strokeWidth="24" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Motion",
    category: "Animations",
    icon: (
      <svg className="w-5 h-5 text-[#5865f2] fill-current" viewBox="0 0 24 24">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
      </svg>
    ),
  },
  {
    name: "Recharts",
    category: "Analytics",
    icon: (
      <svg className="w-5 h-5 text-[#00b0f4]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 16l4-5 4 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Zod",
    category: "Schema Validation",
    icon: (
      <svg className="w-5 h-5 text-[#38bdf8] fill-current" viewBox="0 0 24 24">
        <path d="M4 4h16l-9 11h9v5H4l9-11H4V4z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    category: "Edge Deployment",
    icon: (
      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12 1L24 22H0L12 1z" />
      </svg>
    ),
  },
];

export function TechStackBanner() {
  return (
    <section
      className="relative w-full z-30 border-y border-white/15 bg-[#0a0d3a]/40 backdrop-blur-2xl py-4 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(255,255,255,0.05)]"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="w-full flex items-center">
        {/* Continuous Full-Width Sliding Marquee */}
        <div className="relative w-full overflow-hidden">
          <Marquee
            pauseOnHover={false}
            style={{ "--duration": "30s", "--gap": "2.5rem" } as React.CSSProperties}
            className="py-1"
          >
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200 shrink-0 group cursor-default"
              >
                <div className="w-8 h-8 rounded-md bg-surface-indigo/70 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#5865f2]/60 group-hover:scale-105 transition-all shadow-sm">
                  {tech.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white tracking-wide font-display group-hover:text-[#38bdf8] transition-colors whitespace-nowrap">
                    {tech.name}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-zinc-400 whitespace-nowrap">
                    {tech.category}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>

          {/* Seamless Edge Gradient Fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0d3a]/60 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0d3a]/60 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
