"use client";

import React from "react";
import Image from "next/image";
import { Star } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";

interface AthleteReview {
  id: string;
  name: string;
  username: string;
  role: string;
  discipline: string;
  quote: string;
  avatarUrl: string;
}

const REVIEWS: AthleteReview[] = [
  {
    id: "r-1",
    name: "Marcus Vance",
    username: "@marcus_lifts",
    role: "Competitive Powerlifter",
    discipline: "USAPL 83kg Division",
    quote:
      "RepRise completely replaced three separate tracking apps for me. Logging sets and seeing my daily protein target hit without any clutter is priceless.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-2",
    name: "Elena Rostova",
    username: "@elena_cf",
    role: "CrossFit Coach & Athlete",
    discipline: "Precision Nutrition Certified",
    quote:
      "The daily calorie target was spot-on with my athletes. The macro distribution adjustments make cutting phases completely sustainable.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-3",
    name: "David Chen",
    username: "@david_hybrid",
    role: "Hyrox Competitor",
    discipline: "Endurance & Hybrid Athlete",
    quote:
      "The weight moving average smoothed out my water fluctuations. I finally have an accurate picture of my actual fat loss trajectory.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-4",
    name: "Sarah Jenkins",
    username: "@sjenk_tri",
    role: "Triathlete & Marathoner",
    discipline: "Sub-3hr Marathoner",
    quote:
      "Tracking carbohydrates for 20-mile training blocks used to be a guessing game. The live macro dials keep my energy locked in without crashing.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-5",
    name: "Liam O'Connor",
    username: "@liam_strong",
    role: "Olympic Weightlifter",
    discipline: "Senior Nationals Qualifier",
    quote:
      "No generic bloatware or filler. Just raw macro accuracy, smooth logging, and zero distractions. Exactly what strength athletes need.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-6",
    name: "Maya Lin",
    username: "@maya_moves",
    role: "Strength & Conditioning",
    discipline: "CSCS Coach",
    quote:
      "The food database is blazingly fast and accurate. I can log an entire day of meal prep in less than 90 seconds between training clients.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-7",
    name: "Carlos Mendez",
    username: "@carlos_physique",
    role: "Classic Physique Athlete",
    discipline: "NPC Regional Champion",
    quote:
      "Dialing in peak week macros has never been simpler. The macro precision and trend charts took the stress right out of competition prep.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-8",
    name: "Priya Patel",
    username: "@dr_priya_rd",
    role: "Sports Dietitian",
    discipline: "CSSD & Registered Dietitian",
    quote:
      "As a sports dietitian, I recommend RepRise to all my endurance clients. The custom macro targets align with real metabolic requirements.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-9",
    name: "Tyler Briggs",
    username: "@briggs_power",
    role: "Powerbuilder",
    discipline: "500lb Squat Club",
    quote:
      "Up 15 lbs on my bench and down 4% body fat while keeping my strength. The consistency tracker kept me accountable every single day.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "r-10",
    name: "Chloe Dubois",
    username: "@chloe_wod",
    role: "CrossFit Competitor",
    discipline: "Semifinals Athlete",
    quote:
      "The UI is stunning and so fast. It doesn't fight you when you're logging between sets or on the go at competitions.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=128&auto=format&fit=crop&q=80",
  },
];

const firstRow = REVIEWS.slice(0, 5);
const secondRow = REVIEWS.slice(5);

const TestimonialCard = ({
  name,
  username,
  role,
  discipline,
  quote,
  avatarUrl,
}: AthleteReview) => {
  return (
    <Card className="relative h-full w-80 md:w-96 cursor-pointer overflow-hidden border border-white/10 bg-surface-indigo/70 hover:bg-surface-indigo/90 hover:border-[#5865f2]/50 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-5 shrink-0">
      <CardContent className="p-0 flex flex-col justify-between h-full gap-4">
        <div>
          {/* Rating stars & discipline tag */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex gap-0.5 text-[#00b0f4]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} weight="fill" />
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-[#35ed7e] bg-[#35ed7e]/10 border border-[#35ed7e]/20 px-2 py-0.5 rounded-full">
              {discipline}
            </span>
          </div>

          {/* Quote Body */}
          <p className="text-sm text-zinc-200 leading-relaxed line-clamp-3 font-normal">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Athlete Header */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#5865f2] shrink-0 relative bg-surface-onyx">
            <Image
              src={avatarUrl}
              alt={name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-sm font-bold text-white font-display leading-tight">{name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#00b0f4] font-medium">{username}</span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-xs text-zinc-400 truncate max-w-[120px]">{role}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 border-t border-white/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-14 text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase font-display">
          ENGINEERED FOR REAL PROGRESSION
        </h2>
        <p className="text-base text-zinc-300 leading-relaxed font-normal max-w-2xl">
          See how serious lifters, hybrid athletes, and sports dietitians use RepRise to dial in their daily nutrition and push past plateaus.
        </p>
      </div>

      {/* Marquee Container with subtle gradient edge masks */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
        <Marquee pauseOnHover style={{ "--duration": "35s", "--gap": "1rem" } as React.CSSProperties}>
          {firstRow.map((review) => (
            <TestimonialCard key={review.id} {...review} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover style={{ "--duration": "35s", "--gap": "1rem" } as React.CSSProperties}>
          {secondRow.map((review) => (
            <TestimonialCard key={review.id} {...review} />
          ))}
        </Marquee>

        {/* Soft atmospheric gradient edge masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#0a0d3a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#0a0d3a] to-transparent z-10" />
      </div>
    </section>
  );
}
