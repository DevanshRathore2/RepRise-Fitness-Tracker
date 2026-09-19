"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MagnifyingGlass,
  Plus,
  Minus,
  Trash,
  Check,
  Calendar,
  CaretLeft,
  CaretRight,
  Sparkle,
} from "@phosphor-icons/react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RepRiseStorage } from "@/lib/storage";
import { FoodItem, MealEntry, MealType } from "@/types/fitness";
import BasicDatePicker from "@/components/ui/calendar-1";
import { DateNavigator } from "@/components/ui/DateNavigator";
import { cn } from "@/lib/utils";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMeal);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  // Serving unit selection per food: "default" | "1g"
  const [servingUnits, setServingUnits] = useState<Record<string, "default" | "1g">>({});
  // Raw string input for smooth, glitch-free typing (allows backspace, decimals, etc.)
  const [servingInputs, setServingInputs] = useState<Record<string, string>>({});
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

  const getSelectedUnit = (foodId: string): "default" | "1g" => {
    return servingUnits[foodId] || "default";
  };

  const getServingInputStr = (food: FoodItem): string => {
    if (servingInputs[food.id] !== undefined) {
      return servingInputs[food.id];
    }
    const unit = getSelectedUnit(food.id);
    return unit === "1g" ? String(food.servingAmount || 100) : "1";
  };

  const handleUnitToggle = (food: FoodItem, unit: "default" | "1g") => {
    setServingUnits((prev) => ({ ...prev, [food.id]: unit }));
    // When switching unit, pre-populate intuitive default
    setServingInputs((prev) => ({
      ...prev,
      [food.id]: unit === "1g" ? String(food.servingAmount || 100) : "1",
    }));
  };

  const handleInputChange = (foodId: string, value: string) => {
    // Allow empty string, numbers, and decimals freely while typing
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setServingInputs((prev) => ({ ...prev, [foodId]: value }));
    }
  };

  const handleInputBlur = (food: FoodItem) => {
    const current = servingInputs[food.id];
    if (current === undefined || current === "" || parseFloat(current) <= 0) {
      const unit = getSelectedUnit(food.id);
      const fallback = unit === "1g" ? String(food.servingAmount || 100) : "1";
      setServingInputs((prev) => ({ ...prev, [food.id]: fallback }));
    }
  };

  const handleStepServing = (food: FoodItem, delta: number) => {
    const unit = getSelectedUnit(food.id);
    const currentStr = getServingInputStr(food);
    const currentNum = parseFloat(currentStr) || (unit === "1g" ? (food.servingAmount || 100) : 1);

    if (unit === "1g") {
      const step = delta > 0 ? 10 : -10;
      const next = Math.max(1, Math.round(currentNum + step));
      setServingInputs((prev) => ({ ...prev, [food.id]: String(next) }));
    } else {
      const step = delta > 0 ? 0.5 : -0.5;
      const next = Math.max(0.25, Number((currentNum + step).toFixed(2)));
      setServingInputs((prev) => ({ ...prev, [food.id]: String(next) }));
    }
  };

  const getEffectiveMultiplier = (food: FoodItem): number => {
    const unit = getSelectedUnit(food.id);
    const inputStr = getServingInputStr(food);
    const parsed = parseFloat(inputStr);
    const amount = !isNaN(parsed) && parsed > 0 ? parsed : 0;

    if (unit === "1g") {
      const baseGrams = food.servingAmount > 0 ? food.servingAmount : 100;
      return amount / baseGrams;
    }
    return amount;
  };

  const handleAddFoodToDiary = (food: FoodItem) => {
    const unit = getSelectedUnit(food.id);
    const inputStr = getServingInputStr(food);
    const parsed = parseFloat(inputStr);
    const fallback = unit === "1g" ? (food.servingAmount || 100) : 1;
    const amount = !isNaN(parsed) && parsed > 0 ? parsed : fallback;

    const mult = getEffectiveMultiplier(food);
    const calculatedMult =
      mult > 0
        ? mult
        : unit === "1g"
        ? amount / (food.servingAmount || 100)
        : amount;

    const loggedUnitLabel = unit === "1g" ? `${amount}g` : `${amount}x (${food.servingUnit})`;

    RepRiseStorage.addMeal({
      foodId: food.id,
      name: food.name,
      mealType: selectedMealType,
      servings: amount,
      servingUnit: loggedUnitLabel,
      calories: Math.round(food.calories * calculatedMult),
      protein: Number((food.protein * calculatedMult).toFixed(1)),
      carbs: Number((food.carbs * calculatedMult).toFixed(1)),
      fats: Number((food.fats * calculatedMult).toFixed(1)),
      loggedAt: selectedDate,
    });

    const isToday = selectedDate === todayStr;
    setAddFeedback(
      `Added ${food.name} (${loggedUnitLabel}) to ${selectedMealType} for ${isToday ? "today" : selectedDate}!`
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

          {/* Date Navigator */}
          <div className="self-start sm:self-auto">
            <DateNavigator
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
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
                <div className="p-12 text-center rounded-xl bg-surface-indigo border border-white/10 text-zinc-400 text-sm space-y-3">
                  <p>No foods match &quot;{searchQuery}&quot;.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCustomFoodModalOpen(true)}
                    className="gap-1.5 font-bold mx-auto"
                  >
                    <Plus size={14} weight="bold" />
                    <span>CREATE CUSTOM FOOD ITEM</span>
                  </Button>
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const selectedUnit = getSelectedUnit(food.id);
                  const inputStr = getServingInputStr(food);
                  const mult = getEffectiveMultiplier(food);

                  const scaledCalories = Math.round(food.calories * mult);
                  const scaledProtein = Number((food.protein * mult).toFixed(1));
                  const scaledCarbs = Number((food.carbs * mult).toFixed(1));
                  const scaledFats = Number((food.fats * mult).toFixed(1));

                  return (
                    <div
                      key={food.id}
                      className="p-4 sm:p-5 rounded-xl bg-surface-indigo border border-white/15 hover:border-[#5865f2]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_3px_68px_rgba(69,42,124,0.15)]"
                    >
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base text-white">{food.name}</span>
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#38bdf8]/20 text-white border border-[#38bdf8]/30">
                            {food.category}
                          </span>
                          {food.isCustom && (
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/30">
                              CUSTOM
                            </span>
                          )}
                        </div>

                        {/* Base serving info */}
                        <div className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-1.5 flex-wrap">
                          <span>Base:</span>
                          <span className="text-zinc-200 font-semibold">{food.servingUnit}</span>
                          {food.servingAmount && food.servingAmount > 0 && !food.servingUnit.includes(`${food.servingAmount}g`) ? (
                            <span className="text-zinc-500">({food.servingAmount}g)</span>
                          ) : null}
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-400">{food.calories} kcal base</span>
                        </div>

                        {/* Dynamic scaled macros */}
                        <div className="flex items-center gap-2.5 text-xs font-mono mt-2.5 font-bold flex-wrap">
                          <span className="text-white px-2 py-0.5 rounded-md bg-white/10 font-mono font-extrabold shadow-inner">
                            {scaledCalories} kcal
                          </span>
                          <span className="text-[#00b0f4]">P: {scaledProtein}g</span>
                          <span className="text-[#35ed7e]">C: {scaledCarbs}g</span>
                          <span className="text-[#38bdf8]">F: {scaledFats}g</span>
                        </div>
                      </div>

                      {/* Serving Controls & Add Button */}
                      <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                        {/* Base Serving Unit Selector Toggle */}
                        <div className="flex items-center rounded-lg bg-surface-onyx border border-white/15 p-0.5 shadow-inner">
                          <button
                            type="button"
                            onClick={() => handleUnitToggle(food, "default")}
                            className={cn(
                              "px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer",
                              selectedUnit === "default"
                                ? "bg-[#5865f2] text-white shadow-[0_0_10px_rgba(88,101,242,0.4)]"
                                : "text-zinc-400 hover:text-white"
                            )}
                            title={`Use default base serving (${food.servingUnit})`}
                          >
                            {food.servingUnit.length > 14 ? `${food.servingUnit.slice(0, 12)}...` : food.servingUnit}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUnitToggle(food, "1g")}
                            className={cn(
                              "px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer",
                              selectedUnit === "1g"
                                ? "bg-[#00b0f4] text-black font-extrabold shadow-[0_0_10px_rgba(0,176,244,0.4)]"
                                : "text-zinc-400 hover:text-white"
                            )}
                            title="Log by exact grams (1g base)"
                          >
                            1g
                          </button>
                        </div>

                        {/* Amount Stepper & Textbox (Zero-Glitch) */}
                        <div className="flex items-center bg-surface-onyx rounded-lg border border-white/15 p-0.5">
                          <button
                            type="button"
                            onClick={() => handleStepServing(food, -1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                            title="Decrease amount"
                            aria-label="Decrease amount"
                          >
                            <Minus size={13} weight="bold" />
                          </button>

                          <div className="relative flex items-center px-1">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={inputStr}
                              onChange={(e) => handleInputChange(food.id, e.target.value)}
                              onBlur={() => handleInputBlur(food)}
                              aria-label={`Serving amount for ${food.name}`}
                              className="w-14 h-7 text-center rounded-md bg-[#090c28] border border-white/10 focus:border-[#00b0f4] text-xs font-mono font-bold text-white focus:outline-none transition-colors"
                            />
                            <span className="text-[10px] text-zinc-400 font-mono pl-1 pr-0.5 select-none">
                              {selectedUnit === "1g" ? "g" : "x"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleStepServing(food, 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                            title="Increase amount"
                            aria-label="Increase amount"
                          >
                            <Plus size={13} weight="bold" />
                          </button>
                        </div>

                        {/* Add Button */}
                        <Button
                          size="sm"
                          variant="green"
                          onClick={() => handleAddFoodToDiary(food)}
                          className="gap-1 font-bold h-8 px-3.5 shadow-[0_0_12px_rgba(53,237,126,0.3)]"
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
