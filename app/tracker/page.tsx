"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MagnifyingGlass,
  Plus,
  Trash,
  Check,
  Calendar,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RepRiseStorage } from "@/lib/storage";
import { FoodItem, MealEntry, MealType } from "@/types/fitness";

function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function TrackerContent() {
  const searchParams = useSearchParams();
  const initialMeal = (searchParams.get("meal") as MealType) || "breakfast";
  const todayStr = new Date().toISOString().split("T")[0];
  const paramDate = searchParams.get("date");
  const initialDate = paramDate && /^\d{4}-\d{2}-\d{2}$/.test(paramDate) ? paramDate : todayStr;

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMeal);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [servingMultiplier, setServingMultiplier] = useState<Record<string, number>>({});
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);

  // Custom food modal
  const [customFoodModalOpen, setCustomFoodModalOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customServingUnit, setCustomServingUnit] = useState("100g");
  const [customServingAmount, setCustomServingAmount] = useState(100);
  const [customCalories, setCustomCalories] = useState<number | "">("");
  const [customProtein, setCustomProtein] = useState<number | "">("");
  const [customCarbs, setCustomCarbs] = useState<number | "">("");
  const [customFats, setCustomFats] = useState<number | "">("");
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  const refreshData = (date: string = selectedDate) => {
    setFoods(RepRiseStorage.getFoods());
    setTodayMeals(RepRiseStorage.getMeals(date));
  };

  useEffect(() => {
    refreshData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const handleFoodsUpdate = () => setFoods(RepRiseStorage.getFoods());
    const handleMealsUpdate = () => setTodayMeals(RepRiseStorage.getMeals(selectedDate));

    window.addEventListener("reprise_foods_updated", handleFoodsUpdate);
    window.addEventListener("reprise_meals_updated", handleMealsUpdate);

    return () => {
      window.removeEventListener("reprise_foods_updated", handleFoodsUpdate);
      window.removeEventListener("reprise_meals_updated", handleMealsUpdate);
    };
  }, [selectedDate]);

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const prevStr = date.toISOString().split("T")[0];
    setSelectedDate(prevStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const nextStr = date.toISOString().split("T")[0];
    setSelectedDate(nextStr);
  };

  const handleToday = () => {
    setSelectedDate(todayStr);
  };

  const categories = ["All", "Protein", "Grains", "Dairy", "Fruits", "Vegetables", "Snacks", "Custom"];

  const filteredFoods = foods.filter((food) => {
    const matchesQuery = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const getServings = (id: string) => servingMultiplier[id] || 1;

  const setServings = (id: string, val: number) => {
    setServingMultiplier((prev) => ({ ...prev, [id]: Math.max(0.25, Number(val)) }));
  };

  const handleAddFoodToDiary = (food: FoodItem) => {
    const mult = getServings(food.id);
    RepRiseStorage.addMeal({
      foodId: food.id,
      name: food.name,
      mealType: selectedMealType,
      servings: mult,
      servingUnit: food.servingUnit,
      calories: Math.round(food.calories * mult),
      protein: Number((food.protein * mult).toFixed(1)),
      carbs: Number((food.carbs * mult).toFixed(1)),
      fats: Number((food.fats * mult).toFixed(1)),
      loggedAt: selectedDate,
    });

    const isToday = selectedDate === todayStr;
    setAddFeedback(
      `Added ${food.name} to ${selectedMealType} for ${isToday ? "today" : selectedDate}!`
    );
    setTimeout(() => setAddFeedback(null), 2500);
  };

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || customCalories === "") return;

    RepRiseStorage.addCustomFood({
      name: customName.trim(),
      servingUnit: customServingUnit.trim() || "1 serving",
      servingAmount: Number(customServingAmount) || 100,
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fats: Number(customFats) || 0,
      category: "Custom",
    });

    setCustomFoodModalOpen(false);
    setCustomName("");
    setCustomCalories("");
    setCustomProtein("");
    setCustomCarbs("");
    setCustomFats("");
  };

  return (
    <div className="min-h-screen bg-canvas text-white flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Header Title & Meal Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-indigo border border-white/15 p-6 sm:p-8 rounded-xl shadow-[0_3px_68px_rgba(69,42,124,0.25)]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#35ed7e]">
              NUTRITION LOGGING ENGINE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 uppercase font-display">
              FOOD & CALORIE TRACKER
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Meal Target Selector */}
            <div className="flex items-center p-1 rounded-sm bg-surface-onyx border border-white/10">
              {(["breakfast", "lunch", "dinner", "snacks"] as MealType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedMealType === type
                      ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.5)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCustomFoodModalOpen(true)}
              className="gap-1.5 font-bold"
            >
              <Plus size={16} weight="bold" />
              <span>CREATE CUSTOM FOOD</span>
            </Button>
          </div>
        </div>

        {/* Date Section Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-indigo border border-white/15 shadow-[0_3px_68px_rgba(69,42,124,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#00b0f4] flex items-center justify-center shadow-[0_0_10px_rgba(0,176,244,0.2)]">
              <Calendar size={20} weight="bold" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                DIARY LOGGING DATE
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-display uppercase flex items-center gap-2">
                <span>{formatDisplayDate(selectedDate)}</span>
                {selectedDate === todayStr ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/30">
                    TODAY
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00b0f4]/20 text-[#00b0f4] border border-[#00b0f4]/30">
                    HISTORICAL DIARY
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Date Picker & Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1 bg-surface-onyx p-1 rounded-sm border border-white/10">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous Day"
              >
                <CaretLeft size={16} weight="bold" />
              </button>

              <input
                type="date"
                aria-label="Select Food Diary Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-white px-2 py-1 focus:outline-none cursor-pointer"
              />

              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Next Day"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>

            {selectedDate !== todayStr && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleToday}
                className="text-xs font-bold font-mono text-[#00b0f4] border-[#00b0f4]/40 hover:border-[#00b0f4]"
              >
                <span>JUMP TO TODAY</span>
              </Button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {addFeedback && (
          <div className="p-3.5 rounded-sm bg-[#35ed7e]/15 border border-[#35ed7e]/30 text-[#35ed7e] text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(53,237,126,0.3)]">
            <Check size={16} weight="bold" />
            <span>{addFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Food Database Search & List (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search Input & Category Pills */}
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Search food database (e.g. Chicken breast, Oats, Eggs, Avocado)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-sm bg-surface-indigo border border-white/10 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.4)]"
                        : "bg-surface-indigo text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Cards List */}
            <div className="space-y-3">
              {filteredFoods.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-surface-indigo border border-white/10 text-zinc-400 text-sm">
                  No foods match your search criteria. You can create a custom food item!
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const mult = getServings(food.id);
                  const scaledCalories = Math.round(food.calories * mult);
                  const scaledProtein = Number((food.protein * mult).toFixed(1));
                  const scaledCarbs = Number((food.carbs * mult).toFixed(1));
                  const scaledFats = Number((food.fats * mult).toFixed(1));

                  return (
                    <div
                      key={food.id}
                      className="p-5 rounded-lg bg-surface-indigo border border-white/15 hover:border-[#5865f2]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_3px_68px_rgba(69,42,124,0.15)]"
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{food.name}</span>
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#38bdf8]/20 text-[#ffffff] border border-[#38bdf8]/30">
                            {food.category}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">
                          Base Serving: {food.servingUnit}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono mt-2 font-bold">
                          <span className="text-white">{scaledCalories} kcal</span>
                          <span className="text-[#00b0f4]">P: {scaledProtein}g</span>
                          <span className="text-[#35ed7e]">C: {scaledCarbs}g</span>
                          <span className="text-[#38bdf8]">F: {scaledFats}g</span>
                        </div>
                      </div>

                      {/* Serving Multiplier & Add Button */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-1.5 bg-surface-onyx p-1 rounded-sm border border-white/10">
                          <span className="text-[11px] text-zinc-400 pl-2">Servings:</span>
                          <input
                            type="number"
                            min="0.25"
                            max="20"
                            step="0.25"
                            aria-label={`Servings for ${food.name}`}
                            value={mult}
                            onChange={(e) => setServings(food.id, Number(e.target.value))}
                            className="w-14 h-8 text-center rounded-xs bg-surface-indigo text-xs font-mono font-bold text-white focus:outline-none"
                          />
                        </div>

                        <Button
                          size="sm"
                          variant="green"
                          onClick={() => handleAddFoodToDiary(food)}
                          className="gap-1 font-bold"
                        >
                          <Plus size={14} weight="bold" />
                          <span>ADD</span>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Meal Summary & Selected Date Entries (Span 4) */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-surface-indigo border border-white/15 space-y-6 shadow-[0_3px_68px_rgba(69,42,124,0.2)]">
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight uppercase font-display mb-1">
                {selectedDate === todayStr ? "TODAY'S" : selectedDate} {selectedMealType.toUpperCase()} LOG
              </h3>
              <p className="text-xs text-zinc-400">
                Items recorded for {selectedMealType} on {formatDisplayDate(selectedDate)}.
              </p>
            </div>

            {/* List of items in selected meal slot */}
            <div className="space-y-2.5">
              {todayMeals.filter((m) => m.mealType === selectedMealType).length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-white/10 rounded-lg">
                  No food logged in {selectedMealType} for {selectedDate === todayStr ? "today" : selectedDate}.
                </div>
              ) : (
                todayMeals
                  .filter((m) => m.mealType === selectedMealType)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-sm bg-surface-onyx border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-zinc-100">{item.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {item.servings}x ({item.calories} kcal)
                        </div>
                      </div>
                      <button
                        onClick={() => RepRiseStorage.deleteMeal(item.id)}
                        className="text-zinc-400 hover:text-[#38bdf8] p-1 cursor-pointer transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  ))
              )}
            </div>

            {/* Summary Totals for Selected Meal */}
            <div className="p-4 rounded-lg bg-surface-onyx border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-white pb-2 border-b border-white/10 font-display">
                <span>MEAL TOTAL</span>
                <span className="text-[#35ed7e] font-mono font-bold">
                  {todayMeals
                    .filter((m) => m.mealType === selectedMealType)
                    .reduce((acc, m) => acc + m.calories, 0)}{" "}
                  kcal
                </span>
              </div>
              <div className="flex justify-between text-zinc-300 font-mono text-[11px]">
                <span>Protein</span>
                <span className="text-[#00b0f4] font-bold">
                  {todayMeals
                    .filter((m) => m.mealType === selectedMealType)
                    .reduce((acc, m) => acc + m.protein, 0)}
                  g
                </span>
              </div>
              <div className="flex justify-between text-zinc-300 font-mono text-[11px]">
                <span>Carbohydrates</span>
                <span className="text-[#35ed7e] font-bold">
                  {todayMeals
                    .filter((m) => m.mealType === selectedMealType)
                    .reduce((acc, m) => acc + m.carbs, 0)}
                  g
                </span>
              </div>
              <div className="flex justify-between text-zinc-300 font-mono text-[11px]">
                <span>Fats</span>
                <span className="text-[#38bdf8] font-bold">
                  {todayMeals
                    .filter((m) => m.mealType === selectedMealType)
                    .reduce((acc, m) => acc + m.fats, 0)}
                  g
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Food Creation Modal */}
      <Modal
        isOpen={customFoodModalOpen}
        onClose={() => setCustomFoodModalOpen(false)}
        title="CREATE CUSTOM FOOD ITEM"
        description="Add your proprietary foods, recipes, or supplements to your personal database."
      >
        <form onSubmit={handleCreateCustomFood} className="space-y-4">
          <Input
            label="Food Name"
            required
            placeholder="e.g. Grass-Fed Whey Protein Smoothie"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Serving Unit"
              required
              placeholder="e.g. 1 scoop (35g)"
              value={customServingUnit}
              onChange={(e) => setCustomServingUnit(e.target.value)}
            />

            <Input
              label="Serving Amount (g/ml)"
              type="number"
              value={customServingAmount}
              onChange={(e) => setCustomServingAmount(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Input
              label="Calories (kcal)"
              type="number"
              required
              placeholder="0"
              value={customCalories}
              onChange={(e) =>
                setCustomCalories(e.target.value === "" ? "" : Number(e.target.value))
              }
            />

            <Input
              label="Protein (g)"
              type="number"
              step="0.1"
              placeholder="0"
              value={customProtein}
              onChange={(e) =>
                setCustomProtein(e.target.value === "" ? "" : Number(e.target.value))
              }
            />

            <Input
              label="Carbs (g)"
              type="number"
              step="0.1"
              placeholder="0"
              value={customCarbs}
              onChange={(e) =>
                setCustomCarbs(e.target.value === "" ? "" : Number(e.target.value))
              }
            />

            <Input
              label="Fats (g)"
              type="number"
              step="0.1"
              placeholder="0"
              value={customFats}
              onChange={(e) =>
                setCustomFats(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setCustomFoodModalOpen(false)}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="green" size="md">
              SAVE CUSTOM FOOD
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas text-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackerContent />
    </Suspense>
  );
}
