import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRecipes, createRecipe, deleteRecipe, fetchMealPlan, saveMealPlan } from "@/lib/api";
import type { CreateRecipeInput } from "@/lib/api";

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeInput) => createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useMealPlan() {
  return useQuery({
    queryKey: ["mealplan"],
    queryFn: fetchMealPlan,
  });
}

export function useSaveMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slots: { day: string; meal: string; recipeId: string }[]) =>
      saveMealPlan(slots),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealplan"] });
    },
  });
}
