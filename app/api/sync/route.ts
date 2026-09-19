import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL || !process.env.CLERK_SECRET_KEY) {
      return NextResponse.json(
        { configured: false, message: "Database or Clerk not yet configured" },
        { status: 200 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@reprise.app`;
    const name = clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null;

    // Ensure user exists in database
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { email, name },
      create: { id: userId, email, name },
      include: {
        profile: true,
        weightLogs: { orderBy: { date: "asc" } },
        workouts: { include: { exercises: true }, orderBy: { date: "desc" } },
        personalRecords: true,
      },
    });

    return NextResponse.json({ configured: true, user });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync GET error:", errMessage);
    return NextResponse.json(
      { configured: false, error: errMessage },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || !process.env.CLERK_SECRET_KEY) {
      return NextResponse.json(
        { configured: false, message: "Database or Clerk not yet configured" },
        { status: 200 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@reprise.app`;
    const name = clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null;

    const body = await req.json();
    const { profile, weights, workouts, prs } = body;

    // 1. Upsert User
    await prisma.user.upsert({
      where: { id: userId },
      update: { email, name },
      create: { id: userId, email, name },
    });

    // 2. Upsert Profile if provided
    if (profile) {
      const genderEnum = profile.gender === "female" ? "FEMALE" : "MALE";
      const activityMap: Record<string, "SEDENTARY" | "LIGHT" | "MODERATE" | "VERY_ACTIVE" | "EXTRA_ACTIVE"> = {
        sedentary: "SEDENTARY",
        light: "LIGHT",
        moderate: "MODERATE",
        very_active: "VERY_ACTIVE",
        extra_active: "EXTRA_ACTIVE",
      };
      const goalMap: Record<string, "LOSE_WEIGHT" | "MAINTAIN" | "GAIN_MUSCLE"> = {
        lose_weight: "LOSE_WEIGHT",
        maintain: "MAINTAIN",
        gain_muscle: "GAIN_MUSCLE",
      };

      await prisma.profile.upsert({
        where: { userId },
        update: {
          age: profile.age || 28,
          gender: genderEnum,
          heightCm: profile.heightCm || 175,
          currentWeightKg: profile.currentWeightKg || 70,
          targetWeightKg: profile.targetWeightKg || 68,
          activityLevel: activityMap[profile.activityLevel] || "MODERATE",
          goal: goalMap[profile.goal] || "MAINTAIN",
          dailyCalorieTarget: profile.dailyCalorieTarget || 2000,
          targetProteinGrams: profile.targetProteinGrams || 150,
          targetCarbsGrams: profile.targetCarbsGrams || 200,
          targetFatsGrams: profile.targetFatsGrams || 65,
          streakDays: profile.streakDays ?? 0,
        },
        create: {
          userId,
          age: profile.age || 28,
          gender: genderEnum,
          heightCm: profile.heightCm || 175,
          currentWeightKg: profile.currentWeightKg || 70,
          targetWeightKg: profile.targetWeightKg || 68,
          activityLevel: activityMap[profile.activityLevel] || "MODERATE",
          goal: goalMap[profile.goal] || "MAINTAIN",
          dailyCalorieTarget: profile.dailyCalorieTarget || 2000,
          targetProteinGrams: profile.targetProteinGrams || 150,
          targetCarbsGrams: profile.targetCarbsGrams || 200,
          targetFatsGrams: profile.targetFatsGrams || 65,
          streakDays: profile.streakDays ?? 0,
        },
      });
    }

    // 3. Upsert Weight Logs if provided
    if (Array.isArray(weights) && weights.length > 0) {
      for (const w of weights) {
        if (!w.date || typeof w.weightKg !== "number") continue;
        const logDate = new Date(w.date);
        await prisma.weightLog.upsert({
          where: { id: w.id.startsWith("w-") ? w.id : `w-${w.id}` },
          update: {
            weightKg: w.weightKg,
            notes: w.notes || null,
            date: logDate,
          },
          create: {
            id: w.id.startsWith("w-") ? w.id : `w-${w.id}`,
            userId,
            weightKg: w.weightKg,
            notes: w.notes || null,
            date: logDate,
          },
        });
      }
    }

    // 4. Upsert PRs if provided
    if (Array.isArray(prs) && prs.length > 0) {
      for (const pr of prs) {
        if (!pr.exerciseName || typeof pr.weightKg !== "number") continue;
        await prisma.personalRecord.upsert({
          where: { id: pr.id.startsWith("pr-") ? pr.id : `pr-${pr.id}` },
          update: {
            exerciseName: pr.exerciseName,
            weightKg: pr.weightKg,
            reps: pr.reps || 1,
            achievedDate: pr.achievedDate ? new Date(pr.achievedDate) : new Date(),
          },
          create: {
            id: pr.id.startsWith("pr-") ? pr.id : `pr-${pr.id}`,
            userId,
            exerciseName: pr.exerciseName,
            weightKg: pr.weightKg,
            reps: pr.reps || 1,
            achievedDate: pr.achievedDate ? new Date(pr.achievedDate) : new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync POST error:", errMessage);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
