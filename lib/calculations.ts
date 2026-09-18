import { ActivityLevel, FitnessGoal, Gender } from "@/types/fitness";

export interface CalculationInputs {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
}

export interface MacroTargets {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const GOAL_CALORIE_ADJUSTMENTS: Record<FitnessGoal, number> = {
  lose_weight: -500,
  maintain: 0,
  gain_muscle: 300,
};

/**
 * Calculates Basal Metabolic Rate (BMR).
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? Math.round(base + 5) : Math.round(base - 161);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates complete nutrition goals and macro splits.
 */
export function calculateNutritionTargets(inputs: CalculationInputs): MacroTargets {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = inputs;
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const adjustment = GOAL_CALORIE_ADJUSTMENTS[goal] || 0;
  // Floor calories to a healthy minimum of 1200 kcal
  const dailyCalories = Math.max(1200, tdee + adjustment);

  // Protein calculation: 2.0g per kg of bodyweight (athletic standard)
  let proteinGrams = Math.round(weightKg * 2.0);
  if (goal === "gain_muscle") {
    proteinGrams = Math.round(weightKg * 2.2);
  } else if (goal === "lose_weight") {
    proteinGrams = Math.round(weightKg * 2.1); // High protein preserves lean mass in a deficit
  }
  const proteinCalories = proteinGrams * 4;

  // Fats calculation: 25% of total caloric intake (minimum healthy essential fatty acids)
  const fatCalories = dailyCalories * 0.25;
  const fatsGrams = Math.round(fatCalories / 9);

  // Carbohydrates calculation: Remaining caloric budget
  const remainingCalories = Math.max(0, dailyCalories - (proteinCalories + fatCalories));
  const carbsGrams = Math.round(remainingCalories / 4);

  return {
    bmr,
    tdee,
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
  };
}

/**
 * Helper to format gram weights and macro distributions cleanly.
 */
export function formatGrams(val: number): string {
  return `${Math.round(val)}g`;
}
