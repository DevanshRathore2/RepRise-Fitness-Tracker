"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Fire,
  Plus,
  TrendUp,
  ForkKnife,
  Trash,
  Calendar,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { RepRiseStorage } from "@/lib/storage";
import { MealEntry, MealType, UserProfile } from "@/types/fitness";
import BasicDatePicker, { DatePickerField } from "@/components/ui/calendar-1";

function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function DashboardPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [profile, setProfile] = useState<UserProfile>(RepRiseStorage.getProfile());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [showCalendar, setShowCalendar] = useState(false);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [quickWeightOpen, setQuickWeightOpen] = useState(false);
  const [weightDate, setWeightDate] = useState<string>(todayStr);
  const [newWeight, setNewWeight] = useState("");
  const [weightNotes, setWeightNotes] = useState("");

  const refreshData = (date: string = selectedDate) => {
    setProfile(RepRiseStorage.getProfile());
    setMeals(RepRiseStorage.getMeals(date));
  };

  useEffect(() => {
    refreshData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const handleProfileUpdate = () => setProfile(RepRiseStorage.getProfile());
    const handleMealsUpdate = () => setMeals(RepRiseStorage.getMeals(selectedDate));

    window.addEventListener("reprise_profile_updated", handleProfileUpdate);
    window.addEventListener("reprise_meals_updated", handleMealsUpdate);

    return () => {
      window.removeEventListener("reprise_profile_updated", handleProfileUpdate);
      window.removeEventListener("reprise_meals_updated", handleMealsUpdate);
    };
  }, [selectedDate]);

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(todayStr);
  };

  // Compute daily totals
  const consumedCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = meals.reduce((acc, m) => acc + m.protein, 0);
  const consumedCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
  const consumedFats = meals.reduce((acc, m) => acc + m.fats, 0);

  const remainingCalories = profile.dailyCalorieTarget - consumedCalories;
  const isSurplus = remainingCalories < 0;

  const mealCategories: { type: MealType; label: string }[] = [
    { type: "breakfast", label: "Breakfast" },
    { type: "lunch", label: "Lunch" },
    { type: "dinner", label: "Dinner" },
    { type: "snacks", label: "Snacks & Supplements" },
  ];

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 30) {
      RepRiseStorage.addWeight(val, weightNotes, weightDate);
      setQuickWeightOpen(false);
      setNewWeight("");
      setWeightNotes("");
      setWeightDate(todayStr);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-white flex flex-col">
      <AppHeader onOpenOnboarding={() => setOnboardingOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Welcome & Streak Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-indigo border border-white/15 p-6 sm:p-8 rounded-xl shadow-[0_3px_68px_rgba(69,42,124,0.25)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#35ed7e]">
                DAILY COMMAND HUB
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-xs text-zinc-300">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-display">
              WELCOME BACK, {profile.name}
            </h1>
          </div>

          {/* Streak & Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#00b0f4]/20 border border-[#00b0f4]/30 text-[#ffffff] text-xs font-bold font-mono shadow-[0_0_12px_rgba(0,176,244,0.3)]">
              <Fire size={18} weight="fill" className="text-[#00b0f4]" />
              <span>{profile.streakDays} DAY STREAK</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuickWeightOpen(true)}
              className="gap-1.5"
            >
              <TrendUp size={16} weight="bold" />
              <span>LOG WEIGHT</span>
            </Button>

            <Link href="/tracker">
              <Button size="sm" variant="green" className="gap-1.5">
                <Plus size={16} weight="bold" />
                <span>ADD FOOD</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Daily Calorie & Macro Target Progress Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Calorie Ring Metric (Span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 flex flex-col justify-between shadow-[0_3px_68px_rgba(69,42,124,0.2)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-display">
                CALORIC BALANCE
              </span>
              <span className="text-xs font-mono text-zinc-300 font-semibold">
                Target: {profile.dailyCalorieTarget} kcal
              </span>
            </div>

            <div className="flex items-center justify-around py-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                  {consumedCalories}
                </div>
                <div className="text-xs text-zinc-400 mt-1 font-medium">Consumed</div>
              </div>

              <div className="w-[1px] h-12 bg-white/10" />

              <div className="text-center">
                <div
                  className={`text-3xl sm:text-4xl font-extrabold font-display ${
                    isSurplus ? "text-[#38bdf8]" : "text-[#35ed7e]"
                  }`}
                >
                  {Math.abs(remainingCalories)}
                </div>
                <div className="text-xs text-zinc-400 mt-1 font-medium">
                  {isSurplus ? "Over Target" : "Remaining"}
                </div>
              </div>
            </div>

            <ProgressBar
              current={consumedCalories}
              target={profile.dailyCalorieTarget}
              unit=" kcal"
              color={isSurplus ? "fats" : "carbs"}
              showPercentage
              className="mt-2"
            />
          </div>

          {/* Macro Breakdown Cards (Span 7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 flex flex-col justify-between shadow-[0_3px_68px_rgba(69,42,124,0.2)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-display">
                MACRO TARGET PROGRESS
              </span>
              <span className="text-xs font-mono text-[#35ed7e] font-bold">
                GRAM PRECISION
              </span>
            </div>

            <div className="space-y-4 py-1">
              <ProgressBar
                label="Protein (Muscle Retention & Repair)"
                current={consumedProtein}
                target={profile.targetProteinGrams}
                color="protein"
                showPercentage
              />

              <ProgressBar
                label="Carbohydrates (Glycogen & Training Energy)"
                current={consumedCarbs}
                target={profile.targetCarbsGrams}
                color="carbs"
                showPercentage
              />

              <ProgressBar
                label="Dietary Fats (Hormone Health & Vital Function)"
                current={consumedFats}
                target={profile.targetFatsGrams}
                color="fats"
                showPercentage
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300 font-mono">
              <span className="text-[#00b0f4] font-bold">P: {Math.round(consumedProtein)}g</span>
              <span className="text-[#35ed7e] font-bold">C: {Math.round(consumedCarbs)}g</span>
              <span className="text-[#38bdf8] font-bold">F: {Math.round(consumedFats)}g</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-300 capitalize">Goal: {profile.goal.replace("_", " ")}</span>
            </div>
          </div>
        </div>

        {/* Meal Category Breakdown Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase font-display">
                {selectedDate === todayStr ? "TODAY'S" : selectedDate} MEAL DIARY
              </h2>
              <p className="text-xs text-zinc-400">
                Nutrition intake logged for {formatDisplayDate(selectedDate)}
              </p>
            </div>

            {/* Date Navigator & Tracker Link */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-surface-onyx p-1 rounded-sm border border-white/10">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#0c1033] hover:bg-[#121844] text-xs font-mono font-bold text-white transition-all cursor-pointer border border-white/15"
                  title="Open interactive calendar"
                >
                  <Calendar size={13} className="text-[#00b0f4]" weight="bold" />
                  <span>{selectedDate}</span>
                </button>

                {showCalendar && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <div
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={() => setShowCalendar(false)}
                    />
                    <div className="relative z-50">
                      <BasicDatePicker
                        value={selectedDate}
                        onChange={(newDate) => {
                          setSelectedDate(newDate);
                          setShowCalendar(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNextDay}
                  className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {selectedDate !== todayStr && (
                <button
                  type="button"
                  onClick={handleToday}
                  className="px-2.5 py-1.5 rounded-xs bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#00b0f4] text-xs font-mono font-bold hover:bg-[#5865f2]/30 cursor-pointer transition-colors"
                >
                  TODAY
                </button>
              )}

              <Link
                href={`/tracker?date=${selectedDate}`}
                className="text-xs font-bold text-[#5865f2] hover:text-[#7983f5] transition-colors flex items-center gap-1"
              >
                <span>SEARCH FOOD LIBRARY</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mealCategories.map((category) => {
              const categoryMeals = meals.filter((m) => m.mealType === category.type);
              const categoryCals = categoryMeals.reduce((acc, m) => acc + m.calories, 0);

              return (
                <div
                  key={category.type}
                  className="rounded-lg bg-surface-indigo border border-white/15 p-6 flex flex-col justify-between shadow-[0_3px_68px_rgba(69,42,124,0.15)]"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm bg-[#5865f2] flex items-center justify-center text-white shadow-[0_0_10px_rgba(88,101,242,0.4)]">
                          <ForkKnife size={16} weight="bold" />
                        </div>
                        <h3 className="font-bold text-base text-white uppercase font-display">{category.label}</h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#35ed7e]">
                        {categoryCals} kcal
                      </span>
                    </div>

                    {categoryMeals.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-400">
                        No food items logged for {category.label.toLowerCase()} yet.
                      </div>
                    ) : (
                      <div className="space-y-2.5 mb-4">
                        {categoryMeals.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-sm bg-surface-onyx border border-white/5 text-xs hover:border-white/15 transition-all"
                          >
                            <div className="text-left">
                              <div className="font-bold text-zinc-100">{item.name}</div>
                              <div className="text-zinc-400 font-mono text-[11px]">
                                {item.servings} x {item.servingUnit}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right font-mono">
                                <div className="font-bold text-white">{item.calories} kcal</div>
                                <div className="text-[10px] text-zinc-400">
                                  <span className="text-[#00b0f4]">P:{item.protein}g</span> · <span className="text-[#35ed7e]">C:{item.carbs}g</span> · <span className="text-[#38bdf8]">F:{item.fats}g</span>
                                </div>
                              </div>
                              <button
                                onClick={() => RepRiseStorage.deleteMeal(item.id)}
                                aria-label="Delete entry"
                                className="text-zinc-400 hover:text-[#38bdf8] p-1 transition-colors cursor-pointer"
                              >
                                <Trash size={15} weight="bold" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link href={`/tracker?meal=${category.type}&date=${selectedDate}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs gap-1.5 font-bold uppercase tracking-wider">
                        <Plus size={14} weight="bold" />
                        <span>ADD TO {category.label}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Recalibrate Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onCompleted={refreshData}
      />

      {/* Quick Weight Log Dialog */}
      <Modal
        isOpen={quickWeightOpen}
        onClose={() => setQuickWeightOpen(false)}
        title="LOG MORNING BODY WEIGHT"
        description="Daily weigh-ins update your moving average and target progress for today or any previous day."
      >
        <form onSubmit={handleSaveWeight} className="space-y-4">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            required
            placeholder="e.g. 82.4"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />

          <DatePickerField
            label="Log Date"
            value={weightDate}
            onChange={(d) => setWeightDate(d)}
          />

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Woke up fasted, high carb day yesterday"
            value={weightNotes}
            onChange={(e) => setWeightNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setQuickWeightOpen(false)}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="green" size="md">
              SAVE WEIGHT ENTRY
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
