"use client";

import React, { useState, useEffect } from "react";
import {
  Barbell,
  Plus,
  Trophy,
  CheckCircle,
  Timer,
  Fire,
  Calendar,
  CaretLeft,
  CaretRight,
  Trash,
  Lightning,
  ListChecks,
} from "@phosphor-icons/react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RepRiseStorage } from "@/lib/storage";
import { PersonalRecord, WorkoutSession } from "@/types/fitness";
import { PREMADE_SPLITS } from "@/lib/routines";
import BasicDatePicker, { DatePickerField } from "@/components/ui/calendar-1";

export default function WorkoutsPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);

  // Date filtering state for session history
  const [filterMode, setFilterMode] = useState<"all" | "date">("all");
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [showHistoryCalendar, setShowHistoryCalendar] = useState(false);

  // Premade Routines state
  const [activeSplitId, setActiveSplitId] = useState<string>("ppl");
  const [activeDayId, setActiveDayId] = useState<string>("ppl-push");
  const [showRoutineCalendar, setShowRoutineCalendar] = useState(false);
  const [tickedExerciseIds, setTickedExerciseIds] = useState<Record<string, boolean>>(() => {
    const initialTicks: Record<string, boolean> = {};
    if (PREMADE_SPLITS[0]?.days[0]?.exercises) {
      PREMADE_SPLITS[0].days[0].exercises.forEach((ex) => {
        initialTicks[ex.id] = true;
      });
    }
    return initialTicks;
  });
  const [customExerciseWeights, setCustomExerciseWeights] = useState<Record<string, number | string>>({});
  const [customExerciseReps, setCustomExerciseReps] = useState<Record<string, number | string>>({});
  const [customExerciseSets, setCustomExerciseSets] = useState<Record<string, number | string>>({});
  const [routineLogDate, setRoutineLogDate] = useState<string>(todayStr);
  const [routineDurationMinutes, setRoutineDurationMinutes] = useState<number | string>(60);
  const [routineFeedback, setRoutineFeedback] = useState<string | null>(null);

  // Add custom workout modal state
  const [newWorkoutModalOpen, setNewWorkoutModalOpen] = useState(false);
  const [workoutDate, setWorkoutDate] = useState<string>(todayStr);
  const [workoutName, setWorkoutName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | string>(60);
  const [exerciseName, setExerciseName] = useState("");
  const [targetMuscle, setTargetMuscle] = useState("Chest");
  const [setsCount, setSetsCount] = useState<number | string>(3);
  const [repsCount, setRepsCount] = useState<number | string>(10);
  const [weightKg, setWeightKg] = useState<number | string>(80);

  // New PR modal state
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [prDate, setPrDate] = useState<string>(todayStr);
  const [prExercise, setPrExercise] = useState("");
  const [prWeight, setPrWeight] = useState<number | string>(100);
  const [prReps, setPrReps] = useState<number | string>(1);

  const refreshData = () => {
    setWorkouts(RepRiseStorage.getWorkouts());
    setPrs(RepRiseStorage.getPersonalRecords());
  };

  useEffect(() => {
    refreshData();
    const handleWorkoutsUpdate = () => setWorkouts(RepRiseStorage.getWorkouts());
    const handlePrsUpdate = () => setPrs(RepRiseStorage.getPersonalRecords());

    window.addEventListener("reprise_workouts_updated", handleWorkoutsUpdate);
    window.addEventListener("reprise_prs_updated", handlePrsUpdate);

    return () => {
      window.removeEventListener("reprise_workouts_updated", handleWorkoutsUpdate);
      window.removeEventListener("reprise_prs_updated", handlePrsUpdate);
    };
  }, []);

  const activeSplit = PREMADE_SPLITS.find((s) => s.id === activeSplitId) || PREMADE_SPLITS[0];
  const activeDay = activeSplit.days.find((d) => d.id === activeDayId) || activeSplit.days[0];
  const tickedCount = activeDay.exercises.filter((ex) => tickedExerciseIds[ex.id]).length;

  const handleSelectSplit = (splitId: string) => {
    setActiveSplitId(splitId);
    const split = PREMADE_SPLITS.find((s) => s.id === splitId);
    if (split && split.days.length > 0) {
      setActiveDayId(split.days[0].id);
      setRoutineDurationMinutes(split.days[0].estimatedMinutes);
      const newTicks: Record<string, boolean> = {};
      split.days[0].exercises.forEach((ex) => {
        newTicks[ex.id] = true;
      });
      setTickedExerciseIds(newTicks);
    }
  };

  const handleSelectDay = (dayId: string) => {
    setActiveDayId(dayId);
    const day = activeSplit.days.find((d) => d.id === dayId);
    if (day) {
      setRoutineDurationMinutes(day.estimatedMinutes);
      const newTicks: Record<string, boolean> = {};
      day.exercises.forEach((ex) => {
        newTicks[ex.id] = true;
      });
      setTickedExerciseIds(newTicks);
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    setTickedExerciseIds((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleSelectAllExercises = () => {
    const newTicks: Record<string, boolean> = {};
    activeDay.exercises.forEach((ex) => {
      newTicks[ex.id] = true;
    });
    setTickedExerciseIds(newTicks);
  };

  const handleClearAllExercises = () => {
    setTickedExerciseIds({});
  };

  const handleLogRoutineWorkout = () => {
    const selectedExercises = activeDay.exercises.filter((ex) => tickedExerciseIds[ex.id]);
    if (selectedExercises.length === 0) {
      alert("Please tick at least one exercise to log your workout session.");
      return;
    }

    const exerciseLogs = selectedExercises.map((ex) => {
      const sCount = Number(customExerciseSets[ex.id]) || ex.defaultSets;
      const rCount = Number(customExerciseReps[ex.id]) || ex.defaultReps;
      const wKg =
        customExerciseWeights[ex.id] !== undefined && customExerciseWeights[ex.id] !== ""
          ? Number(customExerciseWeights[ex.id])
          : ex.defaultWeightKg;

      const sets = Array.from({ length: Math.max(1, sCount) }, (_, i) => ({
        setNumber: i + 1,
        reps: Math.max(1, rCount),
        weightKg: Math.max(0, wKg),
        completed: true,
      }));

      return {
        id: `ex-${Date.now()}-${ex.id}`,
        exerciseName: ex.name,
        targetMuscle: ex.targetMuscle,
        restTimeSeconds: ex.restSeconds,
        sets,
      };
    });

    const sessionName = `${activeSplit.name.split(" ")[0]} - ${activeDay.dayName.split("(")[0].trim()}`;

    RepRiseStorage.addWorkout({
      name: sessionName,
      date: routineLogDate || todayStr,
      durationMinutes: Number(routineDurationMinutes) || 60,
      completed: true,
      exercises: exerciseLogs,
    });

    setRoutineFeedback(
      `✓ Logged ${sessionName} (${selectedExercises.length} exercises) for ${routineLogDate === todayStr ? "today" : routineLogDate}!`
    );
    setTimeout(() => setRoutineFeedback(null), 4000);
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName || !exerciseName) return;

    const s = Math.max(1, Number(setsCount) || 1);
    const r = Math.max(1, Number(repsCount) || 1);
    const w = Math.max(0, Number(weightKg) || 0);

    const sets = Array.from({ length: s }, (_, i) => ({
      setNumber: i + 1,
      reps: r,
      weightKg: w,
      completed: true,
    }));

    RepRiseStorage.addWorkout({
      name: workoutName.trim(),
      date: workoutDate || todayStr,
      durationMinutes: Number(durationMinutes) || 60,
      completed: true,
      exercises: [
        {
          id: `ex-${Date.now()}`,
          exerciseName: exerciseName.trim(),
          targetMuscle,
          restTimeSeconds: 90,
          sets,
        },
      ],
    });

    setNewWorkoutModalOpen(false);
    setWorkoutName("");
    setExerciseName("");
    setWorkoutDate(todayStr);
  };

  const handleAddPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prExercise) return;

    RepRiseStorage.addPersonalRecord({
      exerciseName: prExercise.trim(),
      weightKg: Number(prWeight) || 0,
      reps: Number(prReps) || 1,
      achievedDate: prDate || todayStr,
    });

    setPrModalOpen(false);
    setPrExercise("");
    setPrDate(todayStr);
  };

  return (
    <div className="min-h-screen bg-canvas text-white flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-indigo border border-white/15 p-6 sm:p-8 rounded-xl shadow-[0_3px_68px_rgba(69,42,124,0.25)]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#35ed7e]">
              PROGRESSIVE OVERLOAD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 uppercase font-display">
              WORKOUT & STRENGTH TRACKER
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPrModalOpen(true)}
              className="gap-1.5 font-bold"
            >
              <Trophy size={16} weight="bold" />
              <span>RECORD PR</span>
            </Button>

            <Button
              size="sm"
              variant="green"
              onClick={() => setNewWorkoutModalOpen(true)}
              className="gap-1.5 font-bold"
            >
              <Plus size={16} weight="bold" />
              <span>LOG WORKOUT SESSION</span>
            </Button>
          </div>
        </div>

        {/* Stats Row: Streak, Total Sessions, PR Count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 flex items-center gap-4 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="w-12 h-12 rounded-sm bg-[#00b0f4]/20 border border-[#00b0f4]/30 text-[#00b0f4] flex items-center justify-center shadow-[0_0_12px_rgba(0,176,244,0.4)]">
              <Fire size={24} weight="fill" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-bold uppercase font-display">ACTIVE STREAK</div>
              <div className="text-2xl font-extrabold text-white font-mono">14 Days</div>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 flex items-center gap-4 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="w-12 h-12 rounded-sm bg-[#5865f2] text-white flex items-center justify-center shadow-[0_0_12px_rgba(88,101,242,0.5)]">
              <Barbell size={24} weight="bold" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-bold uppercase font-display">TOTAL SESSIONS</div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {workouts.length} Logged
              </div>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-surface-indigo border border-white/15 flex items-center gap-4 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
            <div className="w-12 h-12 rounded-sm bg-[#00b0f4]/20 border border-[#00b0f4]/30 text-[#00b0f4] flex items-center justify-center shadow-[0_0_12px_rgba(0,176,244,0.4)]">
              <Trophy size={24} weight="fill" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-bold uppercase font-display">PERSONAL BENCHMARKS</div>
              <div className="text-2xl font-extrabold text-white font-mono">{prs.length} Records</div>
            </div>
          </div>
        </div>

        {/* Feedback Alert for Routine Log */}
        {routineFeedback && (
          <div className="p-4 rounded-xl bg-[#35ed7e]/15 border border-[#35ed7e]/40 text-[#35ed7e] text-xs font-bold flex items-center justify-between shadow-[0_0_20px_rgba(53,237,126,0.3)]">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" />
              <span>{routineFeedback}</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-300">Added to Session History</span>
          </div>
        )}

        {/* Premade Workout Routines & Splits Section */}
        <div className="p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 space-y-6 shadow-[0_3px_68px_rgba(69,42,124,0.25)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#35ed7e] flex items-center gap-1.5">
                  <Lightning size={14} weight="fill" /> TRAINING BLUEPRINTS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
                PREMADE WORKOUT ROUTINES &amp; SPLITS
              </h2>
              <p className="text-xs text-zinc-300 mt-0.5">
                Pick a proven training routine, select today&apos;s session, and check off the exercises you perform.
              </p>
            </div>

            {/* Split Badge & Frequency */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00b0f4]/20 border border-[#00b0f4]/30 text-[#00b0f4]">
                {activeSplit.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-surface-onyx border border-white/10 text-zinc-300">
                {activeSplit.frequency}
              </span>
            </div>
          </div>

          {/* Split Selector Tabs (PPL, PPL/UL, Bro Split, Full Body) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {PREMADE_SPLITS.map((split) => {
              const isSelected = activeSplitId === split.id;
              return (
                <button
                  key={split.id}
                  type="button"
                  onClick={() => handleSelectSplit(split.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? "bg-[#5865f2] border-[#5865f2] text-white shadow-[0_4px_20px_rgba(88,101,242,0.45)]"
                      : "bg-surface-onyx border-white/10 text-zinc-300 hover:border-white/25 hover:bg-surface-onyx/90"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase font-display tracking-tight">
                      {split.name}
                    </span>
                    {isSelected && <CheckCircle size={16} weight="fill" className="text-white" />}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={isSelected ? "text-white/80" : "text-zinc-400"}>
                      {split.days.length} Sessions
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-xs ${isSelected ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"}`}>
                      {split.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Split Days Selector */}
          <div className="p-4 rounded-lg bg-surface-onyx border border-white/10 space-y-3">
            <div className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <ListChecks size={16} className="text-[#00b0f4]" /> CHOOSE WORKOUT SESSION
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeSplit.days.map((day) => {
                const isSelectedDay = activeDayId === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleSelectDay(day.id)}
                    className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelectedDay
                        ? "bg-[#00b0f4] text-black font-semibold shadow-[0_0_15px_rgba(0,176,244,0.4)]"
                        : "bg-surface-indigo border border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span>{day.dayName.split("(")[0].trim()}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs ${isSelectedDay ? "bg-black/20 text-black font-bold" : "bg-white/10 text-zinc-400"}`}>
                      {day.exercises.length} Exercises
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-zinc-300 pt-1 font-mono flex flex-wrap items-center gap-2">
              <span className="text-zinc-400 font-bold">Focus:</span>
              <span className="text-white font-semibold">{activeDay.focus}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-300 flex items-center gap-1">
                <Timer size={14} className="text-[#35ed7e]" /> ~{activeDay.estimatedMinutes} min
              </span>
            </div>
          </div>

          {/* Exercise Checklist Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-display">
                  EXERCISES PERFORMED ({tickedCount} OF {activeDay.exercises.length} TICKED)
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Tick the exercises you completed and adjust working sets, reps, or weights if needed.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleSelectAllExercises}
                  className="px-2.5 py-1 rounded-xs bg-surface-onyx border border-white/10 text-[11px] font-mono font-bold text-[#00b0f4] hover:bg-white/5 cursor-pointer transition-colors"
                >
                  Tick All
                </button>
                <button
                  type="button"
                  onClick={handleClearAllExercises}
                  className="px-2.5 py-1 rounded-xs bg-surface-onyx border border-white/10 text-[11px] font-mono font-bold text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeDay.exercises.map((ex) => {
                const isTicked = !!tickedExerciseIds[ex.id];
                const setsVal = customExerciseSets[ex.id] || ex.defaultSets;
                const repsVal = customExerciseReps[ex.id] || ex.defaultReps;
                const weightVal = customExerciseWeights[ex.id] !== undefined ? customExerciseWeights[ex.id] : ex.defaultWeightKg;

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleToggleExercise(ex.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-3 ${
                      isTicked
                        ? "bg-[#070b24]/95 border-[#35ed7e]/50 shadow-[0_0_15px_rgba(53,237,126,0.12)]"
                        : "bg-surface-onyx/70 border-white/10 opacity-60 hover:opacity-100 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                            isTicked
                              ? "bg-[#35ed7e] text-black shadow-[0_0_10px_rgba(53,237,126,0.4)]"
                              : "border-2 border-zinc-500 bg-transparent text-transparent"
                          }`}
                        >
                          <CheckCircle size={18} weight="bold" />
                        </div>
                        <div>
                          <div className={`font-bold text-sm leading-tight ${isTicked ? "text-white" : "text-zinc-300"}`}>
                            {ex.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-1">
                            <span className="text-[#00b0f4] font-semibold">{ex.targetMuscle}</span>
                            <span>·</span>
                            <span>Rest {ex.restSeconds}s</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inline Config: Sets x Reps @ Weight */}
                    <div
                      className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs font-mono"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-[11px]">Sets:</span>
                        <input
                          type="number"
                          aria-label={`Sets for ${ex.name}`}
                          min={1}
                          max={10}
                          value={setsVal}
                          onChange={(e) =>
                            setCustomExerciseSets((prev) => ({
                              ...prev,
                              [ex.id]: e.target.value,
                            }))
                          }
                          className="w-12 h-7 text-center rounded-sm bg-[#0c1033] border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-[#00b0f4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                        />

                        <span className="text-zinc-400 text-[11px]">Reps:</span>
                        <input
                          type="number"
                          aria-label={`Reps for ${ex.name}`}
                          min={1}
                          max={50}
                          value={repsVal}
                          onChange={(e) =>
                            setCustomExerciseReps((prev) => ({
                              ...prev,
                              [ex.id]: e.target.value,
                            }))
                          }
                          className="w-12 h-7 text-center rounded-sm bg-[#0c1033] border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-[#00b0f4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 text-[11px]">Weight:</span>
                        <input
                          type="number"
                          aria-label={`Weight in kg for ${ex.name}`}
                          step={0.5}
                          min={0}
                          max={500}
                          value={weightVal}
                          onChange={(e) =>
                            setCustomExerciseWeights((prev) => ({
                              ...prev,
                              [ex.id]: e.target.value,
                            }))
                          }
                          className="w-16 h-7 text-center rounded-sm bg-[#0c1033] border border-white/20 text-[#35ed7e] font-bold text-xs focus:outline-none focus:border-[#35ed7e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                        />
                        <span className="text-zinc-400 text-[11px]">kg</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log Workout Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#070b24]/90 border border-white/15 shadow-inner">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 relative">
                <Calendar size={18} className="text-[#00b0f4]" />
                <span className="text-xs text-zinc-300 font-bold uppercase font-display">Log Date:</span>
                <button
                  type="button"
                  onClick={() => setShowRoutineCalendar(!showRoutineCalendar)}
                  className="h-9 px-3 rounded-sm bg-surface-onyx hover:bg-white/10 border border-white/15 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00b0f4] cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span>{routineLogDate}</span>
                  {routineLogDate === todayStr && (
                    <span className="text-[9px] px-1 rounded-xs bg-[#35ed7e]/20 text-[#35ed7e]">TODAY</span>
                  )}
                </button>

                {showRoutineCalendar && (
                  <div className="absolute left-0 bottom-full mb-2 z-50">
                    <div
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={() => setShowRoutineCalendar(false)}
                    />
                    <div className="relative z-50">
                      <BasicDatePicker
                        value={routineLogDate}
                        onChange={(newDate) => {
                          setRoutineLogDate(newDate);
                          setShowRoutineCalendar(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300 font-bold uppercase font-display">Duration:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    aria-label="Routine Duration in Minutes"
                    min={10}
                    max={300}
                    value={routineDurationMinutes}
                    onChange={(e) => setRoutineDurationMinutes(e.target.value)}
                    className="w-14 h-9 text-center rounded-sm bg-surface-onyx border border-white/15 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00b0f4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-zinc-400 font-mono">min</span>
                </div>
              </div>
            </div>

            <Button
              variant="green"
              size="md"
              onClick={handleLogRoutineWorkout}
              disabled={tickedCount === 0}
              className="gap-2 font-bold uppercase tracking-wider text-xs px-6 py-3 cursor-pointer shadow-[0_4px_20px_rgba(53,237,126,0.3)] hover:shadow-[0_4px_24px_rgba(53,237,126,0.45)]"
            >
              <CheckCircle size={18} weight="bold" />
              <span>LOG COMPLETED WORKOUT ({tickedCount} EXERCISES)</span>
            </Button>
          </div>
        </div>

        {/* Personal Records Board */}
        <div className="p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 space-y-4 shadow-[0_3px_68px_rgba(69,42,124,0.2)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white uppercase font-display">PERSONAL RECORD (PR) BOARD</h2>
              <p className="text-xs text-zinc-300">All-time maximum lifts across key compound movements.</p>
            </div>
          </div>

          {prs.length === 0 ? (
            <div className="p-8 rounded-lg bg-surface-onyx/50 border border-white/5 text-center text-xs text-zinc-400">
              No personal records logged yet. Click &quot;Add PR&quot; above to log your benchmark lifts.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {prs.map((pr) => (
                <div
                  key={pr.id}
                  className="p-5 rounded-lg bg-surface-onyx border border-white/10 hover:border-[#5865f2]/40 transition-colors relative group"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="font-bold text-white">{pr.exerciseName}</span>
                    <div className="flex items-center gap-1.5">
                      <Trophy size={16} weight="fill" className="text-[#35ed7e]" />
                      <button
                        type="button"
                        onClick={() => RepRiseStorage.deletePersonalRecord(pr.id)}
                        className="text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete PR"
                      >
                        <Trash size={13} weight="bold" />
                      </button>
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#35ed7e] font-mono">
                    {pr.weightKg} kg
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-2 pt-2 border-t border-white/5">
                    <span>{pr.reps} {pr.reps === 1 ? "rep max" : "reps"}</span>
                    <span>{pr.achievedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workout Session History with Date Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white uppercase font-display">WORKOUT SESSION HISTORY</h2>
              <p className="text-xs text-zinc-400">
                {filterMode === "date"
                  ? `Showing workouts logged for ${selectedDate === todayStr ? "Today" : selectedDate}`
                  : `Showing all logged training sessions (${workouts.length} total)`}
              </p>
            </div>

            {/* Date Filtering Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-sm bg-surface-onyx border border-white/10">
                <button
                  type="button"
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                    filterMode === "all"
                      ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.4)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ALL DATES
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode("date")}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                    filterMode === "date"
                      ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.4)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  BY DATE
                </button>
              </div>

              {/* Date navigator (active when By Date is selected or anytime to view days) */}
              <div className="flex items-center gap-1.5 p-1 rounded-sm bg-surface-onyx border border-white/10 relative">
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode("date");
                    handlePrevDay();
                  }}
                  className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowHistoryCalendar(!showHistoryCalendar);
                    setFilterMode("date");
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#0c1033] hover:bg-[#121844] text-xs font-mono font-bold text-white transition-all cursor-pointer border border-white/15"
                  title="Open interactive calendar"
                >
                  <Calendar size={13} className="text-[#00b0f4]" weight="bold" />
                  <span>{selectedDate}</span>
                </button>

                {showHistoryCalendar && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <div
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={() => setShowHistoryCalendar(false)}
                    />
                    <div className="relative z-50">
                      <BasicDatePicker
                        value={selectedDate}
                        onChange={(newDate) => {
                          setSelectedDate(newDate);
                          setFilterMode("date");
                          setShowHistoryCalendar(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setFilterMode("date");
                    handleNextDay();
                  }}
                  className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <CaretRight size={16} weight="bold" />
                </button>

                {selectedDate !== todayStr && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(todayStr);
                      setFilterMode("date");
                    }}
                    className="px-2 py-1 rounded-xs bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#00b0f4] text-[10px] font-mono font-bold hover:bg-[#5865f2]/30 cursor-pointer transition-colors"
                  >
                    TODAY
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {workouts.filter((w) => (filterMode === "date" ? w.date === selectedDate : true)).length === 0 ? (
              <div className="p-12 rounded-xl bg-surface-indigo/50 border border-white/10 text-center space-y-3 shadow-[0_3px_68px_rgba(69,42,124,0.1)]">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                  <Barbell size={22} weight="bold" />
                </div>
                <h3 className="font-bold text-base text-white uppercase font-display">
                  {filterMode === "date"
                    ? `No Workout Sessions Logged for ${selectedDate}`
                    : "No Workout Sessions Logged Yet"}
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {filterMode === "date"
                    ? `You have no training logged on ${selectedDate}. Click "Log Workout Session" below to record a previous or current workout!`
                    : "Your training history is completely clean. Click \"Log Workout Session\" to record your exercises, sets, and weights."}
                </p>
                {filterMode === "date" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setWorkoutDate(selectedDate);
                      setNewWorkoutModalOpen(true);
                    }}
                    className="gap-1.5 font-bold mx-auto mt-2"
                  >
                    <Plus size={14} weight="bold" />
                    <span>LOG SESSION FOR {selectedDate}</span>
                  </Button>
                )}
              </div>
            ) : (
              workouts
                .filter((w) => (filterMode === "date" ? w.date === selectedDate : true))
                .map((w) => (
                  <div
                    key={w.id}
                    className="p-6 sm:p-8 rounded-xl bg-surface-indigo border border-white/15 space-y-4 shadow-[0_3px_68px_rgba(69,42,124,0.15)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-[#5865f2] text-white flex items-center justify-center shadow-[0_0_10px_rgba(88,101,242,0.4)]">
                          <Barbell size={20} weight="bold" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white uppercase font-display">{w.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-300 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} className="text-[#00b0f4]" /> {w.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer size={14} className="text-[#35ed7e]" /> {w.durationMinutes} min
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/30">
                          COMPLETED
                        </span>
                        <button
                          type="button"
                          onClick={() => RepRiseStorage.deleteWorkout(w.id)}
                          className="p-1.5 rounded-sm bg-surface-onyx border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                          title="Delete workout session"
                        >
                          <Trash size={15} weight="bold" />
                        </button>
                      </div>
                    </div>

                    {/* Exercises list in this workout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {w.exercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="p-4 rounded-lg bg-surface-onyx border border-white/5 space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-center font-bold text-white">
                            <span>{ex.exerciseName}</span>
                            <span className="text-zinc-400 text-[11px] font-mono">
                              {ex.targetMuscle}
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-[11px]">
                            {ex.sets.map((s) => (
                              <div
                                key={s.setNumber}
                                className="flex justify-between py-1.5 px-3 rounded-xs bg-surface-indigo/80 text-zinc-200 border border-white/5"
                              >
                                <span>Set {s.setNumber}</span>
                                <span className="font-bold text-white">
                                  {s.weightKg} kg x {s.reps} reps
                                </span>
                                <CheckCircle size={15} weight="fill" className="text-[#35ed7e]" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </main>

      {/* Log Workout Session Modal */}
      <Modal
        isOpen={newWorkoutModalOpen}
        onClose={() => setNewWorkoutModalOpen(false)}
        title="LOG WORKOUT SESSION"
        description="Record your training movements, sets, and working weight for today or any previous day."
      >
        <form onSubmit={handleCreateWorkout} className="space-y-4">
          <Input
            label="Workout Session Name"
            required
            placeholder="e.g. Lower Body Squat Focus"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <DatePickerField
              label="Workout Date"
              value={workoutDate}
              onChange={(d) => setWorkoutDate(d)}
            />

            <Input
              label="Duration (Minutes)"
              type="number"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-zinc-300 tracking-wide uppercase font-display">
              Target Muscle
            </label>
            <select
              value={targetMuscle}
              onChange={(e) => setTargetMuscle(e.target.value)}
              className="h-11 px-4 rounded-xl bg-[#0c1033]/90 hover:bg-[#0f1544]/90 focus:bg-[#11174d] border border-white/15 hover:border-white/30 text-white text-sm font-medium focus:outline-none focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/40 transition-all duration-200"
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back / Lats</option>
              <option value="Legs">Quadriceps / Hamstrings</option>
              <option value="Shoulders">Shoulders / Delts</option>
              <option value="Arms">Arms (Biceps & Triceps)</option>
            </select>
          </div>

          <Input
            label="Primary Exercise"
            required
            placeholder="e.g. Barbell Back Squat"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Working Sets"
              type="number"
              min={1}
              max={15}
              value={setsCount}
              onChange={(e) => setSetsCount(e.target.value)}
            />

            <Input
              label="Reps / Set"
              type="number"
              min={1}
              max={50}
              value={repsCount}
              onChange={(e) => setRepsCount(e.target.value)}
            />

            <Input
              label="Weight (kg)"
              type="number"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setNewWorkoutModalOpen(false)}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="green" size="md">
              SAVE WORKOUT
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record PR Modal */}
      <Modal
        isOpen={prModalOpen}
        onClose={() => setPrModalOpen(false)}
        title="RECORD PERSONAL BENCHMARK"
        description="Celebrate and log your new all-time strength milestone."
      >
        <form onSubmit={handleAddPR} className="space-y-4">
          <Input
            label="Exercise Movement"
            required
            placeholder="e.g. Barbell Back Squat"
            value={prExercise}
            onChange={(e) => setPrExercise(e.target.value)}
          />

          <DatePickerField
            label="Date Achieved"
            value={prDate}
            onChange={(d) => setPrDate(d)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Max Weight (kg)"
              type="number"
              step="0.5"
              required
              value={prWeight}
              onChange={(e) => setPrWeight(e.target.value)}
            />

            <Input
              label="Reps Completed"
              type="number"
              min={1}
              max={20}
              required
              value={prReps}
              onChange={(e) => setPrReps(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setPrModalOpen(false)}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="green" size="md">
              SAVE RECORD
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
