"use client";

import React, { useState, useEffect } from "react";
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
import { UserProfile, WeightLog } from "@/types/fitness";
import { DatePickerField } from "@/components/ui/calendar-1";

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile>(RepRiseStorage.getProfile());
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D" | "1Y" | "All">("30D");

  // Log weight modal state
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [inputDate, setInputDate] = useState(new Date().toISOString().split("T")[0]);
  const [inputNotes, setInputNotes] = useState("");

  const refreshData = () => {
    setProfile(RepRiseStorage.getProfile());
    setWeights(RepRiseStorage.getWeights());
  };

  useEffect(() => {
    refreshData();
    const handleWeightsUpdate = () => setWeights(RepRiseStorage.getWeights());
    const handleProfileUpdate = () => setProfile(RepRiseStorage.getProfile());

    window.addEventListener("reprise_weights_updated", handleWeightsUpdate);
    window.addEventListener("reprise_profile_updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("reprise_weights_updated", handleWeightsUpdate);
      window.removeEventListener("reprise_profile_updated", handleProfileUpdate);
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

  // Demo Calorie Consistency data for the past 7 days
  const calorieConsistencyData = [
    { day: "Mon", consumed: 2210, target: profile.dailyCalorieTarget },
    { day: "Tue", consumed: 2280, target: profile.dailyCalorieTarget },
    { day: "Wed", consumed: 2190, target: profile.dailyCalorieTarget },
    { day: "Thu", consumed: 2310, target: profile.dailyCalorieTarget },
    { day: "Fri", consumed: 2240, target: profile.dailyCalorieTarget },
    { day: "Sat", consumed: 2400, target: profile.dailyCalorieTarget },
    { day: "Sun", consumed: 2220, target: profile.dailyCalorieTarget },
  ];

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
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">94%</div>
            <span className="text-[11px] text-[#35ed7e] font-semibold">Within +/- 5% threshold</span>
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
          <div>
            <h3 className="text-xl font-bold text-white uppercase font-display">7-DAY CALORIE ADHERENCE</h3>
            <p className="text-xs text-zinc-300">
              Daily calories consumed compared against target ({profile.dailyCalorieTarget} kcal).
            </p>
          </div>

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
                />
                <ReferenceLine
                  y={profile.dailyCalorieTarget}
                  stroke="#38bdf8"
                  strokeDasharray="3 3"
                />
                <Bar dataKey="consumed" name="Consumed Calories" fill="#35ed7e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
