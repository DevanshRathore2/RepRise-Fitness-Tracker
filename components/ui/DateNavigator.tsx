"use client";

import React, { useState } from "react";
import { Calendar, CaretLeft, CaretRight, Sparkle } from "@phosphor-icons/react";
import BasicDatePicker from "@/components/ui/calendar-1";

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (dateStr: string) => void;
  className?: string;
  showTodayJump?: boolean;
}

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function stepDate(dateStr: string, deltaDays: number): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + deltaDays);
    const nextY = date.getFullYear();
    const nextM = String(date.getMonth() + 1).padStart(2, "0");
    const nextD = String(date.getDate()).padStart(2, "0");
    return `${nextY}-${nextM}-${nextD}`;
  } catch {
    return dateStr;
  }
}

function formatPillDate(dateStr: string, todayStr: string): { label: string; isToday: boolean; isYesterday: boolean; isTomorrow: boolean } {
  try {
    const isToday = dateStr === todayStr;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const yesterdayStr = stepDate(todayStr, -1);
    const tomorrowStr = stepDate(todayStr, 1);
    const isYesterday = dateStr === yesterdayStr;
    const isTomorrow = dateStr === tomorrowStr;

    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const dayNum = date.getDate();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    if (isToday) {
      return { label: `Today, ${monthName} ${dayNum}`, isToday: true, isYesterday: false, isTomorrow: false };
    }
    if (isYesterday) {
      return { label: `Yesterday, ${monthName} ${dayNum}`, isToday: false, isYesterday: true, isTomorrow: false };
    }
    if (isTomorrow) {
      return { label: `Tomorrow, ${monthName} ${dayNum}`, isToday: false, isYesterday: false, isTomorrow: true };
    }
    return { label: `${weekday}, ${monthName} ${dayNum}`, isToday: false, isYesterday: false, isTomorrow: false };
  } catch {
    return { label: dateStr, isToday: dateStr === todayStr, isYesterday: false, isTomorrow: false };
  }
}

export function DateNavigator({
  selectedDate,
  onDateChange,
  className = "",
  showTodayJump = true,
}: DateNavigatorProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const todayStr = getTodayStr();

  const { label, isToday } = formatPillDate(selectedDate, todayStr);

  const handlePrev = () => {
    onDateChange(stepDate(selectedDate, -1));
  };

  const handleNext = () => {
    onDateChange(stepDate(selectedDate, 1));
  };

  const handleToday = () => {
    onDateChange(todayStr);
  };

  return (
    <div className={`flex items-center gap-2 relative ${className}`}>
      {/* Sleek Frosted Glass Capsule */}
      <div className="flex items-center p-1 rounded-full bg-gradient-to-r from-[#0c1033]/95 via-[#101642]/95 to-[#0c1033]/95 hover:from-[#0e1440] hover:to-[#0e1440] border border-white/20 hover:border-[#00b0f4]/50 shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all duration-200">
        {/* Previous Day Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          title="Previous day"
          aria-label="Previous day"
        >
          <CaretLeft size={15} weight="bold" />
        </button>

        {/* Center Interactive Date Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="group flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141b4e] hover:bg-[#1a2364] active:scale-[0.98] border border-white/15 hover:border-[#00b0f4]/60 text-xs font-semibold text-white transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            title="Click to choose date from calendar"
            aria-label="Click to choose date from calendar"
          >
            <Calendar
              size={15}
              weight="fill"
              className="text-[#00b0f4] group-hover:scale-115 transition-transform duration-150 drop-shadow-[0_0_8px_rgba(0,176,244,0.6)]"
            />
            <span className="font-mono tracking-tight font-bold text-zinc-100 text-[13px]">
              {label}
            </span>
            {isToday ? (
              <span
                className="w-2 h-2 rounded-full bg-[#35ed7e] shadow-[0_0_8px_#35ed7e] ring-2 ring-[#35ed7e]/20 animate-pulse"
                title="Showing today"
              />
            ) : (
              <span className="text-[10px] text-zinc-500 font-mono tracking-tighter">
                {selectedDate}
              </span>
            )}
          </button>

          {/* Centered Calendar Popover */}
          {showCalendar && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setShowCalendar(false)}
              />
              <div className="relative z-50 shadow-[0_12px_40px_rgba(0,0,0,0.8)] rounded-xl border border-white/20">
                <BasicDatePicker
                  value={selectedDate}
                  onChange={(newDate) => {
                    onDateChange(newDate);
                    setShowCalendar(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Next Day Arrow */}
        <button
          type="button"
          onClick={handleNext}
          className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          title="Next day"
          aria-label="Next day"
        >
          <CaretRight size={15} weight="bold" />
        </button>
      </div>

      {/* Jump to Today Button */}
      {showTodayJump && !isToday && (
        <button
          type="button"
          onClick={handleToday}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#5865f2]/25 to-[#00b0f4]/25 hover:from-[#5865f2]/40 hover:to-[#00b0f4]/40 border border-[#00b0f4]/40 hover:border-[#00b0f4] text-[#00b0f4] hover:text-white text-[11px] font-mono font-extrabold tracking-wider transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(0,176,244,0.25)] flex items-center gap-1"
          title="Jump back to today"
        >
          <Sparkle size={12} weight="fill" />
          <span>TODAY</span>
        </button>
      )}
    </div>
  );
}

