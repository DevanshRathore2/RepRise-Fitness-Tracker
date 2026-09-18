"use client";

import {
  DEFAULT_PROFILE,
  INITIAL_PRS,
  INITIAL_WEIGHT_LOGS,
  INITIAL_WORKOUTS,
  SEED_FOODS,
} from "@/lib/seedData";
import {
  FoodItem,
  MealEntry,
  PersonalRecord,
  UserProfile,
  WeightLog,
  WorkoutSession,
} from "@/types/fitness";

const STORAGE_KEYS = {
  VERSION: "reprise_clean_v3",
  PROFILE: "reprise_profile",
  MEALS: "reprise_meals",
  FOODS: "reprise_foods",
  WEIGHTS: "reprise_weights",
  WORKOUTS: "reprise_workouts",
  PRS: "reprise_prs",
};

// No pre-filled default meal entries
const INITIAL_MEALS: MealEntry[] = [];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function ensureCleanInitialStorage(): void {
  if (!isBrowser()) return;
  try {
    const v = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!v) {
      // Clear legacy pre-filled demo data so the app starts completely clean
      localStorage.removeItem(STORAGE_KEYS.MEALS);
      localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
      localStorage.removeItem(STORAGE_KEYS.WEIGHTS);
      localStorage.removeItem(STORAGE_KEYS.PRS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.setItem(STORAGE_KEYS.VERSION, "3.0");
    }
  } catch {}
}

export const RepRiseStorage = {
  getProfile(): UserProfile {
    if (!isBrowser()) return DEFAULT_PROFILE;
    ensureCleanInitialStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new Event("reprise_profile_updated"));
  },

  getFoods(): FoodItem[] {
    if (!isBrowser()) return SEED_FOODS;
    try {
      const customData = localStorage.getItem(STORAGE_KEYS.FOODS);
      const customFoods: FoodItem[] = customData ? JSON.parse(customData) : [];
      return [...SEED_FOODS, ...customFoods];
    } catch {
      return SEED_FOODS;
    }
  },

  addCustomFood(food: Omit<FoodItem, "id" | "isCustom">): FoodItem {
    const newFood: FoodItem = {
      ...food,
      id: `custom-${Date.now()}`,
      isCustom: true,
      category: "Custom",
    };
    if (isBrowser()) {
      try {
        const existing = localStorage.getItem(STORAGE_KEYS.FOODS);
        const parsed: FoodItem[] = existing ? JSON.parse(existing) : [];
        parsed.unshift(newFood);
        localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(parsed));
        window.dispatchEvent(new Event("reprise_foods_updated"));
      } catch (err) {
        console.error("Failed to save custom food", err);
      }
    }
    return newFood;
  },

  getMeals(dateString?: string): MealEntry[] {
    const targetDate = dateString || (isBrowser() ? new Date().toISOString().split("T")[0] : "2026-09-18");
    if (!isBrowser()) {
      return INITIAL_MEALS.filter((m) => m.loggedAt === targetDate);
    }
    ensureCleanInitialStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEALS);
      const allMeals: MealEntry[] = data ? JSON.parse(data) : INITIAL_MEALS;
      return allMeals.filter((m) => m.loggedAt === targetDate);
    } catch {
      return INITIAL_MEALS.filter((m) => m.loggedAt === targetDate);
    }
  },

  getAllMeals(): MealEntry[] {
    if (!isBrowser()) return INITIAL_MEALS;
    ensureCleanInitialStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEALS);
      return data ? JSON.parse(data) : INITIAL_MEALS;
    } catch {
      return INITIAL_MEALS;
    }
  },

  addMeal(meal: Omit<MealEntry, "id">): MealEntry {
    const newEntry: MealEntry = {
      ...meal,
      id: `m-${Date.now()}`,
    };
    if (isBrowser()) {
      const all = RepRiseStorage.getAllMeals();
      all.push(newEntry);
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(all));
      window.dispatchEvent(new Event("reprise_meals_updated"));
    }
    return newEntry;
  },

  deleteMeal(id: string): void {
    if (!isBrowser()) return;
    const all = RepRiseStorage.getAllMeals().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(all));
    window.dispatchEvent(new Event("reprise_meals_updated"));
  },

  getWeights(): WeightLog[] {
    if (!isBrowser()) return INITIAL_WEIGHT_LOGS;
    ensureCleanInitialStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      return data ? JSON.parse(data) : INITIAL_WEIGHT_LOGS;
    } catch {
      return INITIAL_WEIGHT_LOGS;
    }
  },

  addWeight(weightKg: number, notes?: string, date?: string): WeightLog {
    const newLog: WeightLog = {
      id: `w-${Date.now()}`,
      weightKg: Number(weightKg.toFixed(1)),
      date: date || new Date().toISOString().split("T")[0],
      notes: notes?.trim() || undefined,
    };
    if (isBrowser()) {
      const all = RepRiseStorage.getWeights();
      // Remove duplicate for the same date if exists
      const filtered = all.filter((w) => w.date !== newLog.date);
      filtered.push(newLog);
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(filtered));

      // Also update current weight on profile
      const profile = RepRiseStorage.getProfile();
      profile.currentWeightKg = newLog.weightKg;
      RepRiseStorage.saveProfile(profile);

      window.dispatchEvent(new Event("reprise_weights_updated"));
    }
    return newLog;
  },

  getWorkouts(): WorkoutSession[] {
    if (!isBrowser()) return INITIAL_WORKOUTS;
    ensureCleanInitialStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      const list: WorkoutSession[] = data ? JSON.parse(data) : INITIAL_WORKOUTS;
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      return INITIAL_WORKOUTS;
    }
  },

  addWorkout(workout: Omit<WorkoutSession, "id">): WorkoutSession {
    const newSession: WorkoutSession = {
      ...workout,
      id: `wo-${Date.now()}`,
    };
    if (isBrowser()) {
      const all = RepRiseStorage.getWorkouts();
      all.unshift(newSession);
      all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(all));
      window.dispatchEvent(new Event("reprise_workouts_updated"));
    }
    return newSession;
  },

  deleteWorkout(id: string): void {
    if (!isBrowser()) return;
    const all = RepRiseStorage.getWorkouts().filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(all));
    window.dispatchEvent(new Event("reprise_workouts_updated"));
  },

  getPersonalRecords(): PersonalRecord[] {
    if (!isBrowser()) return INITIAL_PRS;
    ensureCleanInitialStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRS);
      return data ? JSON.parse(data) : INITIAL_PRS;
    } catch {
      return INITIAL_PRS;
    }
  },

  addPersonalRecord(record: Omit<PersonalRecord, "id">): PersonalRecord {
    const newPR: PersonalRecord = {
      ...record,
      id: `pr-${Date.now()}`,
    };
    if (isBrowser()) {
      const all = RepRiseStorage.getPersonalRecords();
      // Replace existing PR if higher or add new
      const existingIdx = all.findIndex(
        (p) => p.exerciseName.toLowerCase() === record.exerciseName.toLowerCase()
      );
      if (existingIdx >= 0) {
        if (record.weightKg > all[existingIdx].weightKg) {
          all[existingIdx] = newPR;
        }
      } else {
        all.push(newPR);
      }
      localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(all));
      window.dispatchEvent(new Event("reprise_prs_updated"));
    }
    return newPR;
  },

  deletePersonalRecord(id: string): void {
    if (!isBrowser()) return;
    const all = RepRiseStorage.getPersonalRecords().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(all));
    window.dispatchEvent(new Event("reprise_prs_updated"));
  },
};
