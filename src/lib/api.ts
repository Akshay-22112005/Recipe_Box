import type { Recipe } from "@/types/recipe";

const API_BASE = "/api/recipes";

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

export interface CreateRecipeInput {
  title: string;
  description: string;
  image?: string | null;
  imageFile?: File | null;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string[];
  tags: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
}

// ---- Meal Plan ----

export interface MealPlanSlot {
  day: string;
  meal: string;
  recipe: Recipe;
}

export async function fetchMealPlan(): Promise<{ slots: MealPlanSlot[] }> {
  const res = await fetch("/api/mealplan");
  if (!res.ok) throw new Error("Failed to fetch meal plan");
  return res.json();
}

export async function saveMealPlan(
  slots: { day: string; meal: string; recipeId: string }[]
): Promise<void> {
  const res = await fetch("/api/mealplan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slots }),
  });
  if (!res.ok) throw new Error("Failed to save meal plan");
}

// ---- Delete Recipe ----

export async function deleteRecipe(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete recipe");
}

// ---- Create Recipe ----

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("ingredients", JSON.stringify(data.ingredients));
  formData.append("instructions", JSON.stringify(data.instructions));
  formData.append("tags", JSON.stringify(data.tags));
  formData.append("prepTime", String(data.prepTime));
  formData.append("cookTime", String(data.cookTime));
  formData.append("servings", String(data.servings));
  formData.append("difficulty", data.difficulty);

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  const res = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
}
