"use client";
import React, { useState } from "react";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon, Calendar as CalendarIcon } from "lucide-react";

export interface CalendarProps {
  value?: string; // YYYY-MM-DD
  onChange?: (dateStr: string) => void;
  className?: string;
}

export default function BasicDatePicker({ value, onChange, className }: CalendarProps) {
  const defaultVal = value ? [parseDate(new Date(value))] : [parseDate(new Date())];

  return (
    <DatePicker.Root
      inline
      defaultValue={defaultVal}
      onValueChange={(details) => {
        if (details.value && details.value.length > 0 && onChange) {
          const d = details.value[0];
          if (d) {
            const formatted = `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
            onChange(formatted);
          }
        }
      }}
      timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
    >
      <DatePicker.Content className={`bg-[#0c1033] dark:bg-[#0c1033] border border-white/15 dark:border-white/15 rounded-xl shadow-2xl p-3 inline-block ${className || ""}`}>
        <DatePicker.View view="day">
          <DatePicker.Context>
            {(api) => (
              <>
                <DatePicker.ViewControl className="flex items-center justify-between mb-3">
                  <DatePicker.PrevTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white cursor-pointer">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </DatePicker.PrevTrigger>
                  <DatePicker.ViewTrigger className="text-sm font-semibold text-white hover:bg-white/10 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <DatePicker.RangeText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.NextTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white cursor-pointer">
                    <ChevronRightIcon className="w-4 h-4" />
                  </DatePicker.NextTrigger>
                </DatePicker.ViewControl>
                <DatePicker.Table className="w-full border-separate border-spacing-y-0.5">
                  <DatePicker.TableHead>
                    <DatePicker.TableRow>
                      {api.weekDays.map((weekDay, id) => (
                        <DatePicker.TableHeader
                          key={id}
                          className="text-xs font-mono font-bold text-zinc-400 w-9 h-7 text-center"
                        >
                          {weekDay.narrow}
                        </DatePicker.TableHeader>
                      ))}
                    </DatePicker.TableRow>
                  </DatePicker.TableHead>
                  <DatePicker.TableBody>
                    {api.weeks.map((week, id) => (
                      <DatePicker.TableRow key={id}>
                        {week.map((day, id) => (
                          <DatePicker.TableCell
                            key={id}
                            value={day}
                            className="p-0"
                          >
                            <DatePicker.TableCellTrigger className="relative w-9 h-9 text-xs text-zinc-200 hover:bg-white/10 hover:text-white transition-colors data-selected:bg-[#5865f2] data-selected:text-white rounded-lg data-outside-range:text-zinc-600 flex items-center justify-center font-medium data-today:after:content-[''] data-today:after:absolute data-today:after:bottom-1 data-today:after:w-1 data-today:after:h-1 data-today:after:bg-[#00b0f4] data-today:after:rounded-full cursor-pointer">
                              {day.day}
                            </DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        ))}
                      </DatePicker.TableRow>
                    ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
        <DatePicker.View view="month">
          <DatePicker.Context>
            {(api) => (
              <>
                <DatePicker.ViewControl className="flex items-center justify-between mb-4">
                  <DatePicker.PrevTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white cursor-pointer">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </DatePicker.PrevTrigger>
                  <DatePicker.ViewTrigger className="text-sm font-semibold text-white hover:bg-white/10 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <DatePicker.RangeText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.NextTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white cursor-pointer">
                    <ChevronRightIcon className="w-4 h-4" />
                  </DatePicker.NextTrigger>
                </DatePicker.ViewControl>
                <DatePicker.Table className="w-full border-separate border-spacing-y-0.5">
                  <DatePicker.TableBody>
                    {api
                      .getMonthsGrid({ columns: 4, format: "short" })
                      .map((months, id) => (
                        <DatePicker.TableRow key={id}>
                          {months.map((month, id) => (
                            <DatePicker.TableCell key={id} value={month.value}>
                              <DatePicker.TableCellTrigger className="w-16 h-10 text-xs text-zinc-200 hover:bg-white/10 rounded-lg transition-colors data-selected:bg-[#5865f2] data-selected:text-white flex items-center justify-center font-medium cursor-pointer">
                                {month.label}
                              </DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          ))}
                        </DatePicker.TableRow>
                      ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
        <DatePicker.View view="year">
          <DatePicker.Context>
            {(api) => (
              <>
                <DatePicker.ViewControl className="flex items-center justify-between mb-4">
                  <DatePicker.PrevTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white cursor-pointer">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </DatePicker.PrevTrigger>
                  <DatePicker.ViewTrigger className="text-sm font-semibold text-white hover:bg-white/10 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <DatePicker.RangeText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.NextTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white cursor-pointer">
                    <ChevronRightIcon className="w-4 h-4" />
                  </DatePicker.NextTrigger>
                </DatePicker.ViewControl>
                <DatePicker.Table className="w-full border-separate border-spacing-y-0.5">
                  <DatePicker.TableBody>
                    {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                      <DatePicker.TableRow key={id}>
                        {years.map((year, id) => (
                          <DatePicker.TableCell key={id} value={year.value}>
                            <DatePicker.TableCellTrigger className="w-16 h-10 text-xs text-zinc-200 hover:bg-white/10 rounded-lg transition-colors data-selected:bg-[#5865f2] data-selected:text-white flex items-center justify-center font-medium cursor-pointer">
                              {year.label}
                            </DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        ))}
                      </DatePicker.TableRow>
                    ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

export function DatePickerField({
  label,
  value,
  onChange,
  className,
}: {
  label?: string;
  value: string;
  onChange: (dateStr: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left relative ${className || ""}`}>
      {label && (
        <label className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4 rounded-xl bg-[#0c1033]/90 hover:bg-[#0f1544]/90 focus:bg-[#11174d] border border-white/15 hover:border-white/30 focus:border-[#5865f2] text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] flex items-center justify-between cursor-pointer w-full"
      >
        <span className="font-mono text-sm">{value || "Select date"}</span>
        <CalendarIcon className="w-4 h-4 text-[#00b0f4]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50">
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-50">
            <BasicDatePicker
              value={value}
              onChange={(newDate) => {
                onChange(newDate);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

