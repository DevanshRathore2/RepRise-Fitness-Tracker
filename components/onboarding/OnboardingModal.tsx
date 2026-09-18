"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { calculateNutritionTargets } from "@/lib/calculations";
import { RepRiseStorage } from "@/lib/storage";
import { ActivityLevel, FitnessGoal, Gender } from "@/types/fitness";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export function OnboardingModal({ isOpen, onClose, onCompleted }: OnboardingModalProps) {
  const currentProfile = RepRiseStorage.getProfile();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(currentProfile.name);
  const [age, setAge] = useState(currentProfile.age);
  const [gender, setGender] = useState<Gender>(currentProfile.gender);
  const [heightCm, setHeightCm] = useState(currentProfile.heightCm);
  const [currentWeightKg, setCurrentWeightKg] = useState(currentProfile.currentWeightKg);
  const [targetWeightKg, setTargetWeightKg] = useState(currentProfile.targetWeightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(currentProfile.activityLevel);
  const [goal, setGoal] = useState<FitnessGoal>(currentProfile.goal);

  const targets = calculateNutritionTargets({
    age: Number(age) || 25,
    gender,
    heightCm: Number(heightCm) || 175,
    weightKg: Number(currentWeightKg) || 75,
    activityLevel,
    goal,
  });

  const handleSave = () => {
    const updated = {
      ...currentProfile,
      name: name.trim() || "Athlete",
      age: Number(age) || 25,
      gender,
      heightCm: Number(heightCm) || 175,
      currentWeightKg: Number(currentWeightKg) || 75,
      targetWeightKg: Number(targetWeightKg) || 70,
      activityLevel,
      goal,
      dailyCalorieTarget: targets.dailyCalories,
      targetProteinGrams: targets.proteinGrams,
      targetCarbsGrams: targets.carbsGrams,
      targetFatsGrams: targets.fatsGrams,
    };

    RepRiseStorage.saveProfile(updated);
    onClose();
    onCompleted?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CALIBRATE YOUR PROFILE"
      description="Calculate your precise metabolic calorie and macro targets."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-display">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.6)]" : "bg-surface-onyx text-zinc-400"
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? "text-white uppercase" : "text-zinc-500 uppercase"}>Biometrics</span>
          </div>

          <div className="w-8 h-[1px] bg-white/10" />

          <div className="flex items-center gap-2 text-xs font-bold font-display">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.6)]" : "bg-surface-onyx text-zinc-400"
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? "text-white uppercase" : "text-zinc-500 uppercase"}>Lifestyle & Goal</span>
          </div>

          <div className="w-8 h-[1px] bg-white/10" />

          <div className="flex items-center gap-2 text-xs font-bold font-display">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step === 3 ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.6)]" : "bg-surface-onyx text-zinc-400"
              }`}
            >
              3
            </span>
            <span className={step === 3 ? "text-white uppercase" : "text-zinc-500 uppercase"}>Review Plan</span>
          </div>
        </div>

        {/* Step 1: Biometrics */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Athlete Name"
              placeholder="e.g. Devansh Rathore"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                type="number"
                min={15}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display">
                  Sex
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="h-11 px-3 rounded-sm bg-surface-onyx border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Height (cm)"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
              />

              <Input
                label="Current Wt (kg)"
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
              />

              <Input
                label="Target Wt (kg)"
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button size="md" variant="primary" onClick={() => setStep(2)}>
                <span>NEXT: ACTIVITY & GOAL</span>
                <ArrowRight size={16} weight="bold" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Activity & Goal */}
        {step === 2 && (
          <div className="space-y-5 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="h-11 px-3.5 rounded-sm bg-surface-onyx border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="sedentary">Sedentary (Desk work, little exercise)</option>
                <option value="light">Lightly Active (1-3 gym workouts/wk)</option>
                <option value="moderate">Moderately Active (3-5 intense sessions/wk)</option>
                <option value="very_active">Very Active (6-7 training sessions/wk)</option>
                <option value="extra_active">Extra Active (Competitive athlete or manual labor)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                className="h-11 px-3.5 rounded-sm bg-surface-onyx border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="lose_weight">Fat Loss (-500 kcal deficit, high protein)</option>
                <option value="maintain">Body Recomposition & Maintenance</option>
                <option value="gain_muscle">Hypertrophy & Muscle Gain (+300 kcal surplus)</option>
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <Button size="md" variant="ghost" onClick={() => setStep(1)}>
                BACK
              </Button>
              <Button size="md" variant="primary" onClick={() => setStep(3)}>
                <span>CALCULATE MY TARGETS</span>
                <ArrowRight size={16} weight="bold" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review Targets */}
        {step === 3 && (
          <div className="space-y-6 text-left">
            <div className="p-5 rounded-lg bg-surface-onyx border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold font-display">
                    RECOMMENDED CALORIE TARGET
                  </span>
                  <div className="text-3xl font-extrabold text-white mt-0.5 font-display">
                    {targets.dailyCalories}{" "}
                    <span className="text-sm font-bold text-[#5865f2]">kcal / day</span>
                  </div>
                </div>
                <div className="text-right text-xs text-zinc-400 space-y-0.5 font-mono">
                  <div>BMR: {targets.bmr} kcal</div>
                  <div>TDEE: {targets.tdee} kcal</div>
                </div>
              </div>

              {/* Macro Split Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-sm bg-[#00b0f4]/15 border border-[#00b0f4]/30">
                  <span className="text-xs font-bold uppercase text-[#00b0f4] font-display">Protein</span>
                  <div className="text-xl font-bold text-white mt-0.5 font-mono">{targets.proteinGrams}g</div>
                  <span className="text-[10px] text-zinc-400">
                    {Math.round((targets.proteinGrams * 400) / targets.dailyCalories)}% cals
                  </span>
                </div>

                <div className="p-3 rounded-sm bg-[#35ed7e]/15 border border-[#35ed7e]/30">
                  <span className="text-xs font-bold uppercase text-[#35ed7e] font-display">Carbs</span>
                  <div className="text-xl font-bold text-white mt-0.5 font-mono">{targets.carbsGrams}g</div>
                  <span className="text-[10px] text-zinc-400">
                    {Math.round((targets.carbsGrams * 400) / targets.dailyCalories)}% cals
                  </span>
                </div>

                <div className="p-3 rounded-sm bg-[#38bdf8]/15 border border-[#38bdf8]/30">
                  <span className="text-xs font-bold uppercase text-[#38bdf8] font-display">Fats</span>
                  <div className="text-xl font-bold text-white mt-0.5 font-mono">{targets.fatsGrams}g</div>
                  <span className="text-[10px] text-zinc-400">25% cals</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button size="md" variant="ghost" onClick={() => setStep(2)}>
                BACK
              </Button>
              <ShinyButton onClick={handleSave} className="!py-2.5 !px-6 text-xs font-bold uppercase tracking-wider">
                <Check size={16} weight="bold" />
                <span>SAVE PROFILE & ACTIVATE</span>
              </ShinyButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
