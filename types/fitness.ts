export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"      // 1.2
  | "light"          // 1.375
  | "moderate"       // 1.55
  | "very_active"    // 1.725
  | "extra_active";  // 1.9

export type FitnessGoal =
  | "lose_weight"    // -500 kcal
  | "maintain"       // 0 kcal
  | "gain_muscle";   // +300 kcal

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  dailyCalorieTarget: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  streakDays: number;
  createdAt: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export interface FoodItem {
  id: string;
  name: string;
  servingUnit: string;
  servingAmount: number;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  category: "Protein" | "Grains" | "Dairy" | "Fruits" | "Vegetables" | "Snacks" | "Custom";
  isCustom?: boolean;
}

export interface MealEntry {
  id: string;
  foodId: string;
  name: string;
  mealType: MealType;
  servings: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  loggedAt: string; // ISO date string YYYY-MM-DD
}

export interface WeightLog {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  weightKg: number;
  notes?: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  exerciseName: string;
  targetMuscle: string;
  sets: ExerciseSet[];
  restTimeSeconds: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  exercises: ExerciseLog[];
  completed: boolean;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  achievedDate: string;
}

export interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}
