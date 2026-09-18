export interface RoutineExercise {
  id: string;
  name: string;
  targetMuscle: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
  restSeconds: number;
  notes?: string;
}

export interface RoutineDay {
  id: string;
  dayName: string;
  focus: string;
  estimatedMinutes: number;
  exercises: RoutineExercise[];
}

export interface WorkoutSplit {
  id: string;
  name: string;
  badge: string;
  frequency: string;
  description: string;
  days: RoutineDay[];
}

export const PREMADE_SPLITS: WorkoutSplit[] = [
  {
    id: "ppl",
    name: "PPL (Push / Pull / Legs)",
    badge: "Most Popular",
    frequency: "3–6 Days / Week",
    description: "The gold standard hypertrophy & strength split grouping synergist muscle groups for optimal recovery.",
    days: [
      {
        id: "ppl-push",
        dayName: "Push Day (Chest, Shoulders, Triceps)",
        focus: "Horizontal & Vertical Pressing + Tricep Isolation",
        estimatedMinutes: 60,
        exercises: [
          { id: "p-1", name: "Barbell Bench Press", targetMuscle: "Chest", defaultSets: 4, defaultReps: 8, defaultWeightKg: 80, restSeconds: 120 },
          { id: "p-2", name: "Incline Dumbbell Press", targetMuscle: "Chest", defaultSets: 3, defaultReps: 10, defaultWeightKg: 28, restSeconds: 90 },
          { id: "p-3", name: "Standing Overhead Press (OHP)", targetMuscle: "Shoulders", defaultSets: 3, defaultReps: 8, defaultWeightKg: 50, restSeconds: 90 },
          { id: "p-4", name: "Cable Lateral Raises", targetMuscle: "Shoulders", defaultSets: 4, defaultReps: 15, defaultWeightKg: 12, restSeconds: 60 },
          { id: "p-5", name: "Rope Tricep Pushdown", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 25, restSeconds: 60 },
          { id: "p-6", name: "Overhead Dumbbell Extension", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 22, restSeconds: 60 },
        ],
      },
      {
        id: "ppl-pull",
        dayName: "Pull Day (Back, Rear Delts, Biceps)",
        focus: "Vertical & Horizontal Pulling + Elbow Flexors",
        estimatedMinutes: 65,
        exercises: [
          { id: "pl-1", name: "Barbell Bent-Over Row", targetMuscle: "Back", defaultSets: 4, defaultReps: 8, defaultWeightKg: 75, restSeconds: 120 },
          { id: "pl-2", name: "Lat Pulldown (Neutral Grip)", targetMuscle: "Back", defaultSets: 3, defaultReps: 10, defaultWeightKg: 65, restSeconds: 90 },
          { id: "pl-3", name: "Seated Cable Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 12, defaultWeightKg: 60, restSeconds: 90 },
          { id: "pl-4", name: "Face Pulls", targetMuscle: "Rear Delts", defaultSets: 4, defaultReps: 15, defaultWeightKg: 20, restSeconds: 60 },
          { id: "pl-5", name: "Incline Dumbbell Bicep Curl", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 14, restSeconds: 60 },
          { id: "pl-6", name: "Standing Hammer Curls", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 16, restSeconds: 60 },
        ],
      },
      {
        id: "ppl-legs",
        dayName: "Legs Day (Quads, Hamstrings, Calves)",
        focus: "Knee Dominant & Hip Hinge Compound Movements",
        estimatedMinutes: 70,
        exercises: [
          { id: "lg-1", name: "Barbell Back Squat", targetMuscle: "Quads", defaultSets: 4, defaultReps: 6, defaultWeightKg: 100, restSeconds: 150 },
          { id: "lg-2", name: "Romanian Deadlift (RDL)", targetMuscle: "Hamstrings", defaultSets: 3, defaultReps: 8, defaultWeightKg: 90, restSeconds: 120 },
          { id: "lg-3", name: "Leg Press (Quad Focus)", targetMuscle: "Quads", defaultSets: 3, defaultReps: 12, defaultWeightKg: 180, restSeconds: 90 },
          { id: "lg-4", name: "Lying Leg Curls", targetMuscle: "Hamstrings", defaultSets: 3, defaultReps: 12, defaultWeightKg: 45, restSeconds: 60 },
          { id: "lg-5", name: "Standing Calf Raises", targetMuscle: "Calves", defaultSets: 4, defaultReps: 15, defaultWeightKg: 60, restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: "ppl-ul",
    name: "PPL / UL (5-Day Hybrid)",
    badge: "Advanced Hybrid",
    frequency: "5 Days / Week",
    description: "High-frequency combination of PPL with an Upper/Lower block for maximizing weekly volume and progression.",
    days: [
      {
        id: "ppl-ul-push",
        dayName: "Push (Strength Focus)",
        focus: "Heavy Compound Pressing & Anterior Delts",
        estimatedMinutes: 60,
        exercises: [
          { id: "pul-1", name: "Barbell Bench Press", targetMuscle: "Chest", defaultSets: 4, defaultReps: 6, defaultWeightKg: 85, restSeconds: 120 },
          { id: "pul-2", name: "Incline Barbell Press", targetMuscle: "Chest", defaultSets: 3, defaultReps: 8, defaultWeightKg: 65, restSeconds: 90 },
          { id: "pul-3", name: "Dumbbell Lateral Raise", targetMuscle: "Shoulders", defaultSets: 4, defaultReps: 12, defaultWeightKg: 14, restSeconds: 60 },
          { id: "pul-4", name: "EZ Bar Skull Crushers", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 10, defaultWeightKg: 35, restSeconds: 60 },
        ],
      },
      {
        id: "ppl-ul-pull",
        dayName: "Pull (Strength Focus)",
        focus: "Lat Width, Back Thickness & Forearm/Biceps",
        estimatedMinutes: 60,
        exercises: [
          { id: "pul-5", name: "Weighted Pull-Ups", targetMuscle: "Back", defaultSets: 4, defaultReps: 6, defaultWeightKg: 15, restSeconds: 120 },
          { id: "pul-6", name: "Chest-Supported T-Bar Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 8, defaultWeightKg: 60, restSeconds: 90 },
          { id: "pul-7", name: "Reverse Pec Deck", targetMuscle: "Rear Delts", defaultSets: 3, defaultReps: 15, defaultWeightKg: 40, restSeconds: 60 },
          { id: "pul-8", name: "Preacher Curls", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 10, defaultWeightKg: 30, restSeconds: 60 },
        ],
      },
      {
        id: "ppl-ul-legs",
        dayName: "Legs (Quad & Posterior Chain)",
        focus: "Squat Mechanics & Hamstring Overload",
        estimatedMinutes: 65,
        exercises: [
          { id: "pul-9", name: "Barbell Back Squat", targetMuscle: "Quads", defaultSets: 4, defaultReps: 6, defaultWeightKg: 105, restSeconds: 150 },
          { id: "pul-10", name: "Bulgarian Split Squat", targetMuscle: "Quads", defaultSets: 3, defaultReps: 10, defaultWeightKg: 22, restSeconds: 90 },
          { id: "pul-11", name: "Seated Hamstring Curls", targetMuscle: "Hamstrings", defaultSets: 3, defaultReps: 12, defaultWeightKg: 50, restSeconds: 60 },
          { id: "pul-12", name: "Seated Calf Raises", targetMuscle: "Calves", defaultSets: 4, defaultReps: 15, defaultWeightKg: 45, restSeconds: 60 },
        ],
      },
      {
        id: "ppl-ul-upper",
        dayName: "Upper Body (Hypertrophy)",
        focus: "Complete Upper Torso Volume & Pump",
        estimatedMinutes: 65,
        exercises: [
          { id: "pul-13", name: "Standing Overhead Barbell Press", targetMuscle: "Shoulders", defaultSets: 3, defaultReps: 8, defaultWeightKg: 52.5, restSeconds: 90 },
          { id: "pul-14", name: "Incline Dumbbell Fly-Press", targetMuscle: "Chest", defaultSets: 3, defaultReps: 12, defaultWeightKg: 24, restSeconds: 90 },
          { id: "pul-15", name: "Dumbbell Chest Supported Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 12, defaultWeightKg: 30, restSeconds: 90 },
          { id: "pul-16", name: "Cable Crossover Flyes", targetMuscle: "Chest", defaultSets: 3, defaultReps: 15, defaultWeightKg: 15, restSeconds: 60 },
          { id: "pul-17", name: "Cable Bicep Curls", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 25, restSeconds: 60 },
          { id: "pul-18", name: "Dips (Bodyweight or Weighted)", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 0, restSeconds: 60 },
        ],
      },
      {
        id: "ppl-ul-lower",
        dayName: "Lower Body (Posterior Focus)",
        focus: "Deadlift Power, Hamstrings & Glutes",
        estimatedMinutes: 60,
        exercises: [
          { id: "pul-19", name: "Conventional Barbell Deadlift", targetMuscle: "Back/Hamstrings", defaultSets: 3, defaultReps: 5, defaultWeightKg: 120, restSeconds: 180 },
          { id: "pul-20", name: "Hack Squat", targetMuscle: "Quads", defaultSets: 3, defaultReps: 10, defaultWeightKg: 120, restSeconds: 90 },
          { id: "pul-21", name: "Romanian Deadlift (Dumbbell)", targetMuscle: "Hamstrings", defaultSets: 3, defaultReps: 12, defaultWeightKg: 32, restSeconds: 90 },
          { id: "pul-22", name: "Hanging Leg Raises", targetMuscle: "Core", defaultSets: 3, defaultReps: 15, defaultWeightKg: 0, restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: "bro-split",
    name: "Bro Split (Classic Bodypart)",
    badge: "High Volume",
    frequency: "5 Days / Week",
    description: "Dedicate an entire training session to a single muscle group for maximum mechanical fatigue and volume isolation.",
    days: [
      {
        id: "bro-chest",
        dayName: "Chest Day",
        focus: "Pectoral Isolation, Heavy Compounds & Cable Stretch",
        estimatedMinutes: 60,
        exercises: [
          { id: "bro-1", name: "Flat Barbell Bench Press", targetMuscle: "Chest", defaultSets: 4, defaultReps: 8, defaultWeightKg: 80, restSeconds: 120 },
          { id: "bro-2", name: "Incline Dumbbell Press", targetMuscle: "Chest", defaultSets: 4, defaultReps: 10, defaultWeightKg: 28, restSeconds: 90 },
          { id: "bro-3", name: "Decline Dumbbell Press", targetMuscle: "Chest", defaultSets: 3, defaultReps: 10, defaultWeightKg: 26, restSeconds: 90 },
          { id: "bro-4", name: "High-to-Low Cable Flyes", targetMuscle: "Chest", defaultSets: 3, defaultReps: 15, defaultWeightKg: 15, restSeconds: 60 },
          { id: "bro-5", name: "Bodyweight Push-Ups to Failure", targetMuscle: "Chest", defaultSets: 3, defaultReps: 20, defaultWeightKg: 0, restSeconds: 60 },
        ],
      },
      {
        id: "bro-back",
        dayName: "Back Day",
        focus: "Lat Width, Mid-Trap Density & Spinal Erectors",
        estimatedMinutes: 65,
        exercises: [
          { id: "bro-6", name: "Conventional Barbell Deadlift", targetMuscle: "Back", defaultSets: 4, defaultReps: 6, defaultWeightKg: 110, restSeconds: 150 },
          { id: "bro-7", name: "Wide-Grip Lat Pulldown", targetMuscle: "Back", defaultSets: 4, defaultReps: 10, defaultWeightKg: 65, restSeconds: 90 },
          { id: "bro-8", name: "Barbell Pendlay Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 8, defaultWeightKg: 70, restSeconds: 90 },
          { id: "bro-9", name: "One-Arm Dumbbell Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 10, defaultWeightKg: 32, restSeconds: 60 },
          { id: "bro-10", name: "Back Hyperextensions", targetMuscle: "Lower Back", defaultSets: 3, defaultReps: 15, defaultWeightKg: 10, restSeconds: 60 },
        ],
      },
      {
        id: "bro-shoulders",
        dayName: "Shoulder Day",
        focus: "3D Deltoid Caps (Anterior, Lateral, Posterior)",
        estimatedMinutes: 55,
        exercises: [
          { id: "bro-11", name: "Seated Dumbbell Shoulder Press", targetMuscle: "Shoulders", defaultSets: 4, defaultReps: 8, defaultWeightKg: 26, restSeconds: 90 },
          { id: "bro-12", name: "Standing Dumbbell Lateral Raises", targetMuscle: "Shoulders", defaultSets: 4, defaultReps: 15, defaultWeightKg: 12, restSeconds: 60 },
          { id: "bro-13", name: "Arnold Press", targetMuscle: "Shoulders", defaultSets: 3, defaultReps: 10, defaultWeightKg: 20, restSeconds: 60 },
          { id: "bro-14", name: "Rear Delt Dumbbell Flyes", targetMuscle: "Rear Delts", defaultSets: 4, defaultReps: 15, defaultWeightKg: 10, restSeconds: 60 },
          { id: "bro-15", name: "Barbell Shrugs", targetMuscle: "Traps", defaultSets: 4, defaultReps: 12, defaultWeightKg: 80, restSeconds: 60 },
        ],
      },
      {
        id: "bro-arms",
        dayName: "Arms Day (Biceps & Triceps)",
        focus: "Superset Pump, Peak Contraction & Long-Head Triceps",
        estimatedMinutes: 60,
        exercises: [
          { id: "bro-16", name: "Close-Grip Barbell Bench Press", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 8, defaultWeightKg: 70, restSeconds: 90 },
          { id: "bro-17", name: "Barbell Bicep Curl", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 10, defaultWeightKg: 35, restSeconds: 60 },
          { id: "bro-18", name: "Skull Crushers (EZ Bar)", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 10, defaultWeightKg: 32.5, restSeconds: 60 },
          { id: "bro-19", name: "Incline Dumbbell Hammer Curls", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 14, restSeconds: 60 },
          { id: "bro-20", name: "Overhead Rope Cable Extension", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 15, defaultWeightKg: 22, restSeconds: 60 },
          { id: "bro-21", name: "Spider / Concentration Curls", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 12, restSeconds: 60 },
        ],
      },
      {
        id: "bro-legs",
        dayName: "Legs Day",
        focus: "Quad Sweep, Hamstring Separation & Calves",
        estimatedMinutes: 70,
        exercises: [
          { id: "bro-22", name: "Barbell Back Squat", targetMuscle: "Quads", defaultSets: 4, defaultReps: 8, defaultWeightKg: 95, restSeconds: 120 },
          { id: "bro-23", name: "Leg Press", targetMuscle: "Quads", defaultSets: 4, defaultReps: 10, defaultWeightKg: 200, restSeconds: 90 },
          { id: "bro-24", name: "Seated Leg Extensions", targetMuscle: "Quads", defaultSets: 3, defaultReps: 15, defaultWeightKg: 60, restSeconds: 60 },
          { id: "bro-25", name: "Lying Hamstring Curls", targetMuscle: "Hamstrings", defaultSets: 4, defaultReps: 12, defaultWeightKg: 45, restSeconds: 60 },
          { id: "bro-26", name: "Walking Dumbbell Lunges", targetMuscle: "Glutes/Quads", defaultSets: 3, defaultReps: 12, defaultWeightKg: 20, restSeconds: 60 },
          { id: "bro-27", name: "Standing Calf Raises", targetMuscle: "Calves", defaultSets: 4, defaultReps: 20, defaultWeightKg: 65, restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: "full-body",
    name: "Full Body Split",
    badge: "Efficiency & Athleticism",
    frequency: "3 Days / Week",
    description: "High motor unit recruitment hitting every major muscle group 3x weekly with alternated intensity days.",
    days: [
      {
        id: "fb-a",
        dayName: "Full Body A (Squat & Horizontal Focus)",
        focus: "Heavy Squats, Flat Bench & Rowing Movement",
        estimatedMinutes: 60,
        exercises: [
          { id: "fb-1", name: "Barbell Back Squat", targetMuscle: "Quads", defaultSets: 3, defaultReps: 6, defaultWeightKg: 95, restSeconds: 120 },
          { id: "fb-2", name: "Flat Barbell Bench Press", targetMuscle: "Chest", defaultSets: 3, defaultReps: 8, defaultWeightKg: 75, restSeconds: 90 },
          { id: "fb-3", name: "Barbell Bent-Over Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 8, defaultWeightKg: 70, restSeconds: 90 },
          { id: "fb-4", name: "Dumbbell Lateral Raise", targetMuscle: "Shoulders", defaultSets: 3, defaultReps: 15, defaultWeightKg: 12, restSeconds: 60 },
          { id: "fb-5", name: "Standing Barbell Curls", targetMuscle: "Biceps", defaultSets: 3, defaultReps: 10, defaultWeightKg: 30, restSeconds: 60 },
        ],
      },
      {
        id: "fb-b",
        dayName: "Full Body B (Deadlift & Overhead Focus)",
        focus: "Posterior Chain, Overhead Pressing & Pull-ups",
        estimatedMinutes: 60,
        exercises: [
          { id: "fb-6", name: "Conventional Barbell Deadlift", targetMuscle: "Back/Hamstrings", defaultSets: 3, defaultReps: 5, defaultWeightKg: 115, restSeconds: 150 },
          { id: "fb-7", name: "Standing Overhead Military Press", targetMuscle: "Shoulders", defaultSets: 3, defaultReps: 8, defaultWeightKg: 50, restSeconds: 90 },
          { id: "fb-8", name: "Wide-Grip Lat Pulldown / Pull-Ups", targetMuscle: "Back", defaultSets: 3, defaultReps: 10, defaultWeightKg: 65, restSeconds: 90 },
          { id: "fb-9", name: "Walking Dumbbell Lunges", targetMuscle: "Quads/Glutes", defaultSets: 3, defaultReps: 10, defaultWeightKg: 20, restSeconds: 60 },
          { id: "fb-10", name: "Dips or Tricep Pushdowns", targetMuscle: "Triceps", defaultSets: 3, defaultReps: 12, defaultWeightKg: 25, restSeconds: 60 },
        ],
      },
      {
        id: "fb-c",
        dayName: "Full Body C (Hypertrophy & Accessory)",
        focus: "Leg Press, Incline DB, RDL & Core",
        estimatedMinutes: 60,
        exercises: [
          { id: "fb-11", name: "Leg Press", targetMuscle: "Quads", defaultSets: 3, defaultReps: 10, defaultWeightKg: 180, restSeconds: 90 },
          { id: "fb-12", name: "Incline Dumbbell Bench Press", targetMuscle: "Chest", defaultSets: 3, defaultReps: 10, defaultWeightKg: 26, restSeconds: 90 },
          { id: "fb-13", name: "Seated Cable Row", targetMuscle: "Back", defaultSets: 3, defaultReps: 12, defaultWeightKg: 60, restSeconds: 60 },
          { id: "fb-14", name: "Romanian Deadlift (RDL)", targetMuscle: "Hamstrings", defaultSets: 3, defaultReps: 10, defaultWeightKg: 85, restSeconds: 90 },
          { id: "fb-15", name: "Cable Lateral Raises", targetMuscle: "Shoulders", defaultSets: 3, defaultReps: 15, defaultWeightKg: 10, restSeconds: 60 },
          { id: "fb-16", name: "Hanging Knee / Leg Raises", targetMuscle: "Core", defaultSets: 3, defaultReps: 15, defaultWeightKg: 0, restSeconds: 60 },
        ],
      },
    ],
  },
];
