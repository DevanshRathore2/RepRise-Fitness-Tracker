"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { RepRiseStorage } from "@/lib/storage";

export function CloudSyncManager() {
  const { isSignedIn, user } = useUser();
  const isSyncingRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync up to cloud
  const pushToCloud = async () => {
    if (!isSignedIn) return;
    try {
      const profile = RepRiseStorage.getProfile();
      const weights = RepRiseStorage.getWeights();
      const workouts = RepRiseStorage.getWorkouts();
      const prs = RepRiseStorage.getPersonalRecords();

      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, weights, workouts, prs }),
      });
    } catch (err) {
      console.warn("Cloud sync push deferred:", err);
    }
  };

  const schedulePush = () => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      pushToCloud();
    }, 1500);
  };

  useEffect(() => {
    if (!isSignedIn || !user) return;

    // 1. Initial Pull on Sign-In
    const pullFromCloud = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        const res = await fetch("/api/sync");
        if (res.ok) {
          const data = await res.json();
          if (data.configured && data.user) {
            const cloudUser = data.user;
            if (cloudUser.profile) {
              const currentLocal = RepRiseStorage.getProfile();
              // If local profile name matches or is default, update from cloud
              const updatedProfile = {
                ...currentLocal,
                name: cloudUser.name || currentLocal.name,
                age: cloudUser.profile.age,
                gender: cloudUser.profile.gender.toLowerCase(),
                heightCm: cloudUser.profile.heightCm,
                currentWeightKg: cloudUser.profile.currentWeightKg,
                targetWeightKg: cloudUser.profile.targetWeightKg,
                activityLevel: cloudUser.profile.activityLevel.toLowerCase(),
                goal: cloudUser.profile.goal.toLowerCase(),
                dailyCalorieTarget: cloudUser.profile.dailyCalorieTarget,
                targetProteinGrams: cloudUser.profile.targetProteinGrams,
                targetCarbsGrams: cloudUser.profile.targetCarbsGrams,
                targetFatsGrams: cloudUser.profile.targetFatsGrams,
                streakDays: cloudUser.profile.streakDays,
              };
              RepRiseStorage.saveProfile(updatedProfile);
            }
          } else {
            // First time login for this user: immediately push local onboarding data to cloud!
            pushToCloud();
          }
        }
      } catch (err) {
        console.warn("Initial sync pull deferred:", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    pullFromCloud();

    // 2. Listen to local changes and sync to cloud
    const events = [
      "reprise_profile_updated",
      "reprise_weights_updated",
      "reprise_workouts_updated",
      "reprise_prs_updated",
    ];

    events.forEach((evt) => window.addEventListener(evt, schedulePush));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, schedulePush));
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [isSignedIn, user]);

  return null; // Silent background manager
}
