"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { calculateNutritionTargets } from "@/lib/calculations";
import { RepRiseStorage } from "@/lib/storage";
import { ActivityLevel, FitnessGoal, Gender } from "@/types/fitness";

interface CalorieCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalorieCalculatorModal({ isOpen, onClose }: CalorieCalculatorModalProps) {
  const router = useRouter();
  const [age, setAge] = useState<string | number>(28);
  const [gender, setGender] = useState<Gender>("male");
  const [weightKg, setWeightKg] = useState<string | number>(82);
  const [heightCm, setHeightCm] = useState<string | number>(180);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<FitnessGoal>("lose_weight");

  const parsedAge = age === "" ? 25 : Number(age);
  const parsedWeight = weightKg === "" ? 75 : Number(weightKg);
  const parsedHeight = heightCm === "" ? 175 : Number(heightCm);

  const targets = calculateNutritionTargets({
    age: isNaN(parsedAge) || parsedAge <= 0 ? 25 : parsedAge,
    gender,
    weightKg: isNaN(parsedWeight) || parsedWeight <= 0 ? 75 : parsedWeight,
    heightCm: isNaN(parsedHeight) || parsedHeight <= 0 ? 175 : parsedHeight,
    activityLevel: activity,
    goal,
  });

  const handleApplyAndLaunch = () => {
    const profile = RepRiseStorage.getProfile();
    profile.age = isNaN(parsedAge) || parsedAge <= 0 ? 25 : parsedAge;
    profile.gender = gender;
    profile.heightCm = isNaN(parsedHeight) || parsedHeight <= 0 ? 175 : parsedHeight;
    profile.currentWeightKg = isNaN(parsedWeight) || parsedWeight <= 0 ? 75 : parsedWeight;
    profile.activityLevel = activity;
    profile.goal = goal;
    profile.dailyCalorieTarget = targets.dailyCalories;
    profile.targetProteinGrams = targets.proteinGrams;
    profile.targetCarbsGrams = targets.carbsGrams;
    profile.targetFatsGrams = targets.fatsGrams;
    RepRiseStorage.saveProfile(profile);
    onClose();
    router.push("/dashboard");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily Calorie & Macro Target Calculator" maxWidth="lg">
      <div className="space-y-6 text-left">
        {/* Metric Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="AGE (YEARS)"
            type="number"
            min={15}
            max={90}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-display">BIOLOGICAL SEX</label>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-[#0c1033]/90 hover:bg-[#0f1544]/90 focus:bg-[#11174d] border border-white/15 hover:border-white/30 text-white text-sm font-medium focus:outline-none focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/40 appearance-none cursor-pointer transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] focus:shadow-[0_0_20px_rgba(88,101,242,0.3)]"
              >
                <option value="male" className="bg-[#0b0f33] text-white">Male</option>
                <option value="female" className="bg-[#0b0f33] text-white">Female</option>
              </select>
              <CaretDown
                size={16}
                weight="bold"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
            </div>
          </div>

          <Input
            label="BODY WEIGHT (KG)"
            type="number"
            min={35}
            max={250}
            step={0.5}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />

          <Input
            label="HEIGHT (CM)"
            type="number"
            min={120}
            max={230}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </div>

        {/* Activity Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-display">ACTIVITY COEFFICIENT</label>
          <div className="relative">
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full h-11 pl-4 pr-10 rounded-xl bg-[#0c1033]/90 hover:bg-[#0f1544]/90 focus:bg-[#11174d] border border-white/15 hover:border-white/30 text-white text-sm font-medium focus:outline-none focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/40 appearance-none cursor-pointer transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] focus:shadow-[0_0_20px_rgba(88,101,242,0.3)]"
            >
              <option value="sedentary" className="bg-[#0b0f33] text-white">Sedentary (Desk Job, Minimal Training)</option>
              <option value="light" className="bg-[#0b0f33] text-white">Lightly Active (1-3 Workouts/Week)</option>
              <option value="moderate" className="bg-[#0b0f33] text-white">Moderately Active (3-5 Hard Sessions/Week)</option>
              <option value="very_active" className="bg-[#0b0f33] text-white">Very Active (6-7 Heavy Sessions/Week)</option>
              <option value="extra_active" className="bg-[#0b0f33] text-white">Extremely Active (Competitive Hybrid / 2x Daily)</option>
            </select>
            <CaretDown
              size={16}
              weight="bold"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Primary Goal */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">PHYSIQUE TRAJECTORY</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "lose_weight", label: "Fat Loss (-500 kcal)" },
              { id: "maintain", label: "Maintain / Recomp" },
              { id: "gain_muscle", label: "Build Muscle (+300 kcal)" },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id as FitnessGoal)}
                className={`py-2 px-2.5 rounded-sm border text-xs font-bold transition-all text-center ${
                  goal === g.id
                    ? "bg-[#5865f2] border-[#5865f2] text-white shadow-[0_0_12px_rgba(88,101,242,0.4)]"
                    : "bg-surface-onyx border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Realtime Calculated Results Display */}
        <div className="p-5 rounded-lg bg-surface-onyx border border-[#5865f2]/40">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 font-display">
            RECOMMENDED DAILY METABOLIC INTAKE
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mb-4">
            {targets.dailyCalories.toLocaleString()} <span className="text-sm font-sans text-[#35ed7e]">kcal / day</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Protein Target</div>
              <div className="text-base font-bold text-[#00b0f4] font-mono">{targets.proteinGrams}g</div>
              <div className="text-[10px] text-zinc-500">({Math.round((targets.proteinGrams * 4 / targets.dailyCalories) * 100)}%)</div>
            </div>
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Carbohydrates</div>
              <div className="text-base font-bold text-[#35ed7e] font-mono">{targets.carbsGrams}g</div>
              <div className="text-[10px] text-zinc-500">({Math.round((targets.carbsGrams * 4 / targets.dailyCalories) * 100)}%)</div>
            </div>
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Healthy Fats</div>
              <div className="text-base font-bold text-[#38bdf8] font-mono">{targets.fatsGrams}g</div>
              <div className="text-[10px] text-zinc-500">({Math.round((targets.fatsGrams * 9 / targets.dailyCalories) * 100)}%)</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3 justify-end items-center pt-2">
          <Button variant="ghost" size="md" onClick={onClose}>
            CLOSE
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleApplyAndLaunch}
            className="gap-2 font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-lg shadow-[0_4px_20px_rgba(88,101,242,0.35)] hover:shadow-[0_4px_24px_rgba(88,101,242,0.55)] cursor-pointer transition-all"
          >
            <span>APPLY TO MY PROFILE</span>
            <ArrowRight size={16} weight="bold" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
