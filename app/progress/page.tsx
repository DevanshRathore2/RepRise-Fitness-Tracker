"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { TrendUp, Plus, Target, Scales, Fire } from "@phosphor-icons/react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RepRiseStorage } from "@/lib/storage";
import { MealEntry, UserProfile, WeightLog } from "@/types/fitness";
import { DatePickerField } from "@/components/ui/calendar-1";

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile>(RepRiseStorage.getProfile());
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D" | "1Y" | "All">("30D");

  const [meals, setMeals] = useState<MealEntry[]>([]);

  // Log weight modal state
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [inputDate, setInputDate] = useState(new Date().toISOString().split("T")[0]);
  const [inputNotes, setInputNotes] = useState("");

  const refreshData = () => {
    setProfile(RepRiseStorage.getProfile());
    setWeights(RepRiseStorage.getWeights());
    setMeals(RepRiseStorage.getAllMeals());
  };

  useEffect(() => {
    refreshData();
    const handleWeightsUpdate = () => setWeights(RepRiseStorage.getWeights());
    const handleProfileUpdate = () => setProfile(RepRiseStorage.getProfile());
    const handleMealsUpdate = () => setMeals(RepRiseStorage.getAllMeals());

    window.addEventListener("reprise_weights_updated", handleWeightsUpdate);
    window.addEventListener("reprise_profile_updated", handleProfileUpdate);
    window.addEventListener("reprise_meals_updated", handleMealsUpdate);

    return () => {
      window.removeEventListener("reprise_weights_updated", handleWeightsUpdate);
      window.removeEventListener("reprise_profile_updated", handleProfileUpdate);
      window.removeEventListener("reprise_meals_updated", handleMealsUpdate);
    };
  }, []);

  // Filter weights based on time range
  const filteredWeights = [...weights].filter((item) => {
    if (timeRange === "All") return true;
    const itemDate = new Date(item.date).getTime();
    const now = new Date().getTime();
    const daysMap = { "7D": 7, "30D": 30, "90D": 90, "1Y": 365 };
    const maxDays = daysMap[timeRange] || 30;
    return now - itemDate <= maxDays * 24 * 60 * 60 * 1000;
  });

  const startingWeight = weights.length > 0 ? weights[0].weightKg : profile.currentWeightKg;
  const latestWeight =
    weights.length > 0 ? weights[weights.length - 1].weightKg : profile.currentWeightKg;
  const totalChange = Number((latestWeight - startingWeight).toFixed(1));
  const targetDiff = Number((latestWeight - profile.targetWeightKg).toFixed(1));

  // Dynamically compute real Calorie Consistency for the past 7 days from user's logged meals
  const calorieConsistencyData = useMemo(() => {
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${dayNum}`;

      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayLabel = i === 0 ? "Today" : weekday;

      const dayMeals = meals.filter((item) => item.loggedAt === dateStr);
      const consumed = dayMeals.reduce((acc, item) => acc + item.calories, 0);

      result.push({
        date: dateStr,
        day: dayLabel,
        consumed,
        target: profile.dailyCalorieTarget,
      });
    }
    return result;
  }, [meals, profile.dailyCalorieTarget]);

  // Real compliance calculation based on logged days
  const daysWithLoggedFood = calorieConsistencyData.filter((d) => d.consumed > 0);
  const compliantDays = daysWithLoggedFood.filter(
    (d) => Math.abs(d.consumed - profile.dailyCalorieTarget) <= profile.dailyCalorieTarget * 0.1
  );
  const adherenceRate =
    daysWithLoggedFood.length > 0
      ? Math.round((compliantDays.length / daysWithLoggedFood.length) * 100)
      : null;

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    if (!isNaN(val) && val > 30) {
      RepRiseStorage.addWeight(val, inputNotes, inputDate);
      setLogModalOpen(false);
      setInputWeight("");
      setInputNotes("");
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-white flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-indigo border border-white/15 p-6 sm:p-8 rounded-xl shadow-[0_3px_68px_rgba(69,42,124,0.25)]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#35ed7e]">
              KINETIC ANALYTICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 uppercase font-display">
              WEIGHT & PROGRESSION TRACKING
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Filter Buttons */}
            <div className="flex items-center p-1 rounded-sm bg-surface-onyx border border-white/10">
              {(["7D", "30D", "90D", "1Y", "All"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-xs text-xs font-mono font-bold transition-all cursor-pointer ${
                    timeRange === range
                      ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.5)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="green"
              onClick={() => setLogModalOpen(true)}
              className="gap-1.5"
            >
              <Plus size={16} weight="bold" />
              <span>LOG WEIGHT</span>
            </Button>
          </div>
        </div>

        {/* Key Progression Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
              <span className="uppercase tracking-wider font-bold text-[11px] font-display">Current Weight</span>
              <Scales size={20} className="text-[#35ed7e]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{latestWeight} kg</div>
            <span className="text-[11px] text-zinc-400">Updated today</span>
          </div>

          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
              <span className="uppercase tracking-wider font-bold text-[11px] font-display">Goal Target</span>
              <Target size={20} className="text-[#00b0f4]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{profile.targetWeightKg} kg</div>
            <span className="text-[11px] text-zinc-400">{Math.abs(targetDiff)} kg to goal</span>
          </div>

          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
              <span className="uppercase tracking-wider font-bold text-[11px] font-display">Total Change</span>
              <TrendUp size={20} className="text-[#38bdf8]" />
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                totalChange < 0 ? "text-[#35ed7e]" : "text-[#38bdf8]"
              }`}
            >
              {totalChange > 0 ? `+${totalChange}` : totalChange} kg
            </div>
            <span className="text-[11px] text-zinc-400">From {startingWeight} kg start</span>
          </div>

          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
              <span className="uppercase tracking-wider font-bold text-[11px] font-display">Calorie Adherence</span>
              <Fire size={20} className="text-[#5865f2]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {adherenceRate !== null ? `${adherenceRate}%` : "--"}
            </div>
            <span className="text-[11px] text-zinc-400">
              {daysWithLoggedFood.length > 0
                ? `${daysWithLoggedFood.length} of 7 days logged`
                : "No meals logged in past 7 days"}
            </span>
          </div>
        </div>

        {/* Weight History Line Chart (Recharts) */}
        <div className="p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 space-y-4 shadow-[0_3px_68px_rgba(69,42,124,0.2)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-white uppercase font-display">BODY WEIGHT TRAJECTORY</h3>
              <p className="text-xs text-zinc-300">
                Daily weigh-ins with goal target benchmark line.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5865f2] shadow-[0_0_8px_rgba(88,101,242,0.8)]" /> Weigh-In Curve
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00b0f4]" /> Target Goal
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredWeights}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="date"
                  stroke="#8e9297"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(str) => str.slice(5)}
                />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  stroke="#8e9297"
                  fontSize={11}
                  tickLine={false}
                  unit=" kg"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e2353",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                />
                <ReferenceLine
                  y={profile.targetWeightKg}
                  stroke="#00b0f4"
                  strokeDasharray="4 4"
                  label={{
                    value: "Target Goal",
                    fill: "#00b0f4",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weightKg"
                  name="Weight"
                  stroke="#5865f2"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#5865f2", strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "#35ed7e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Consistency Bar Chart */}
        <div className="p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 space-y-4 shadow-[0_3px_68px_rgba(69,42,124,0.2)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-white uppercase font-display">7-DAY CALORIE ADHERENCE</h3>
              <p className="text-xs text-zinc-300">
                Daily calories consumed compared against target ({profile.dailyCalorieTarget} kcal).
              </p>
            </div>
            <Link
              href="/tracker"
              className="text-xs font-mono font-bold text-[#5865f2] hover:text-[#7983f5] transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              <span>LOG IN FOOD DIARY</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {daysWithLoggedFood.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-surface-onyx border border-white/10 space-y-3">
              <p className="text-zinc-200 text-sm font-bold">
                No food logged in the past 7 days yet.
              </p>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                As you log your meals in the Food Diary, your actual daily calories will be tracked and charted here against your {profile.dailyCalorieTarget} kcal target.
              </p>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(88,101,242,0.4)]"
              >
                <span>OPEN FOOD DIARY</span>
                <span>&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieConsistencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" stroke="#8e9297" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8e9297" fontSize={11} tickLine={false} unit=" kcal" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e2353",
                      borderColor: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#ffffff",
                    }}
                    formatter={(val: number) => [`${val} kcal`, "Consumed"]}
                    labelFormatter={(label, payload) => {
                      const item = payload && payload[0]?.payload;
                      return item ? `${item.day} (${item.date})` : label;
                    }}
                  />
                  <ReferenceLine
                    y={profile.dailyCalorieTarget}
                    stroke="#38bdf8"
                    strokeDasharray="3 3"
                    label={{
                      value: `Target: ${profile.dailyCalorieTarget} kcal`,
                      fill: "#38bdf8",
                      fontSize: 10,
                      position: "insideTopRight",
                    }}
                  />
                  <Bar
                    dataKey="consumed"
                    name="Consumed Calories"
                    fill="#35ed7e"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>

      {/* Log Weight Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="RECORD WEIGHT LOG"
        description="Save your scale weigh-in with optional context notes."
      >
        <form onSubmit={handleAddWeight} className="space-y-4">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            required
            placeholder="e.g. 82.4"
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
          />

          <DatePickerField
            label="Date"
            value={inputDate}
            onChange={(d) => setInputDate(d)}
          />

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Post rest-day, 8 hours sleep"
            value={inputNotes}
            onChange={(e) => setInputNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setLogModalOpen(false)}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="green" size="md">
              SAVE ENTRY
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
