import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Recipe } from "@/types/recipe";
import { useMealPlan, useSaveMealPlan } from "@/hooks/useRecipes";

interface MealPlannerProps {
  recipes: Recipe[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
const LOCAL_STORAGE_KEY = "recipe-box-meal-plan";

function buildEmptyPlan(): Record<string, Record<string, Recipe | null>> {
  const initial: Record<string, Record<string, Recipe | null>> = {};
  DAYS.forEach((day) => {
    initial[day] = {};
    MEALS.forEach((meal) => { initial[day][meal] = null; });
  });
  return initial;
}

/** Save the current plan to localStorage as a fallback. */
function persistToLocalStorage(plan: Record<string, Record<string, Recipe | null>>) {
  try {
    const slots: { day: string; meal: string; recipe: Recipe }[] = [];
    DAYS.forEach((day) => {
      MEALS.forEach((meal) => {
        const recipe = plan[day][meal];
        if (recipe) slots.push({ day, meal, recipe });
      });
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(slots));
  } catch { /* quota exceeded – ignore */ }
}

/** Load plan from localStorage (used as fallback when server data is unavailable). */
function loadFromLocalStorage(): Record<string, Record<string, Recipe | null>> | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const slots: { day: string; meal: string; recipe: Recipe }[] = JSON.parse(raw);
    if (!Array.isArray(slots) || slots.length === 0) return null;
    const next = buildEmptyPlan();
    slots.forEach(({ day, meal, recipe }) => {
      if (next[day]) next[day][meal] = recipe;
    });
    return next;
  } catch {
    return null;
  }
}

const MealPlanner = ({ recipes }: MealPlannerProps) => {
  const { data: savedPlan, isError: fetchError } = useMealPlan();
  const saveMutation = useSaveMealPlan();

  const [plan, setPlan] = useState<Record<string, Record<string, Recipe | null>>>(() => {
    // Initialise from localStorage so the plan is visible immediately on refresh,
    // even before the server responds.
    return loadFromLocalStorage() ?? buildEmptyPlan();
  });
  const [dirty, setDirty] = useState(false);
  const [showPicker, setShowPicker] = useState<{ day: string; meal: string } | null>(null);

  // When server data arrives, treat it as the source of truth.
  useEffect(() => {
    if (!savedPlan?.slots?.length) return;
    setPlan(() => {
      const next = buildEmptyPlan();
      savedPlan.slots.forEach(({ day, meal, recipe }) => {
        if (next[day]) next[day][meal] = recipe;
      });
      // Keep localStorage in sync with server data
      persistToLocalStorage(next);
      return next;
    });
    setDirty(false);
  }, [savedPlan]);

  // Show a warning if the server fetch failed so user knows data may be stale.
  useEffect(() => {
    if (fetchError) {
      toast.error("Could not load meal plan from server – showing locally saved data.");
    }
  }, [fetchError]);

  const assignRecipe = (day: string, meal: string, recipe: Recipe) => {
    setPlan((prev) => {
      const next = { ...prev, [day]: { ...prev[day], [meal]: recipe } };
      persistToLocalStorage(next);
      return next;
    });
    setShowPicker(null);
    setDirty(true);
  };

  const clearSlot = (day: string, meal: string) => {
    setPlan((prev) => {
      const next = { ...prev, [day]: { ...prev[day], [meal]: null } };
      persistToLocalStorage(next);
      return next;
    });
    setDirty(true);
  };

  const handleSave = useCallback(() => {
    const slots: { day: string; meal: string; recipeId: string }[] = [];
    DAYS.forEach((day) => {
      MEALS.forEach((meal) => {
        const recipe = plan[day][meal];
        if (recipe) slots.push({ day, meal, recipeId: recipe.id });
      });
    });
    saveMutation.mutate(slots, {
      onSuccess: () => {
        setDirty(false);
        persistToLocalStorage(plan);
        toast.success("Meal plan saved!");
      },
      onError: () => {
        toast.error("Failed to save meal plan to server. Your changes are saved locally.");
      },
    });
  }, [plan, saveMutation]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Meal Planner</h2>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground hidden sm:block">Click + to assign recipes</p>
          <button
            onClick={handleSave}
            disabled={!dirty || saveMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Plan
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2">
            <div className="p-3" />
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-center font-display font-semibold text-sm text-foreground">
                {day.slice(0, 3)}
              </div>
            ))}

            {MEALS.map((meal) => (
              <>
                <div key={meal} className="p-3 flex items-center font-medium text-sm text-muted-foreground">
                  {meal}
                </div>
                {DAYS.map((day) => {
                  const recipe = plan[day][meal];
                  return (
                    <div
                      key={`${day}-${meal}`}
                      className="relative p-2 rounded-xl border bg-card min-h-[90px] flex items-center justify-center"
                    >
                      {recipe ? (
                        <div className="text-center w-full">
                          <img src={recipe.image} alt={recipe.title} className="w-full h-12 object-cover rounded-lg mb-1" />
                          <p className="text-xs font-medium text-card-foreground line-clamp-2">{recipe.title}</p>
                          <button
                            onClick={() => clearSlot(day, meal)}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPicker({ day, meal })}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {showPicker && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-semibold">
              Pick a recipe for {showPicker.day} {showPicker.meal}
            </h4>
            <button onClick={() => setShowPicker(null)} className="p-1 rounded hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {recipes.map((r) => (
              <button
                key={r.id}
                onClick={() => assignRecipe(showPicker.day, showPicker.meal, r)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <img src={r.image} alt={r.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <span className="text-sm font-medium text-card-foreground line-clamp-2">{r.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MealPlanner;
