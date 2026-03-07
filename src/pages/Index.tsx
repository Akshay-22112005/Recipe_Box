import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import CreateRecipeDialog from "@/components/CreateRecipeDialog";
import MealPlanner from "@/components/MealPlanner";
import CookbooksSection from "@/components/CookbooksSection";
import CommunityFeed from "@/components/CommunityFeed";
import { useRecipes, useCreateRecipe, useDeleteRecipe } from "@/hooks/useRecipes";
import type { Recipe, DifficultyFilter, SortOption } from "@/types/recipe";

const Index = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const { data: recipes = [], isLoading } = useRecipes();
  const createRecipeMutation = useCreateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const [maxTime, setMaxTime] = useState(120);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (selectedRecipe?.id === id) {
      setSelectedRecipe((prev) => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    }
  };

  const recipesWithSaved = useMemo(
    () => recipes.map((r) => ({ ...r, isSaved: savedIds.has(r.id) })),
    [recipes, savedIds]
  );

  const filteredRecipes = useMemo(() => {
    let result = recipesWithSaved.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.name.toLowerCase().includes(q)) ||
        r.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => r.tags.includes(tag));

      const matchesDifficulty = difficulty === "All" || r.difficulty === difficulty;
      const matchesTime = r.prepTime + r.cookTime <= maxTime;

      return matchesSearch && matchesTags && matchesDifficulty && matchesTime;
    });

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "quickest") return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [recipesWithSaved, searchQuery, selectedTags, difficulty, maxTime, sortBy]);

  const savedRecipes = recipesWithSaved.filter((r) => r.isSaved);

  const handleDeleteRecipe = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    deleteRecipeMutation.mutate(id, {
      onSuccess: () => {
        if (selectedRecipe?.id === id) setSelectedRecipe(null);
      },
    });
  };

  const handleCreateRecipe = async (data: any) => {
    try {
      await createRecipeMutation.mutateAsync({
        title: data.title,
        description: data.description,
        imageFile: data.imageFile || null,
        ingredients: data.ingredients,
        instructions: data.instructions,
        tags: data.tags,
        prepTime: data.prepTime || 0,
        cookTime: data.cookTime || 0,
        servings: data.servings || 1,
        difficulty: data.difficulty,
      });
    } catch (err) {
      console.error("Failed to create recipe:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCreateClick={() => setShowCreate(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "discover" && (
        <>
          <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="container mx-auto px-4 py-10">
            <SearchFilters
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              maxTime={maxTime}
              onMaxTimeChange={setMaxTime}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filteredRecipes.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredRecipes.map((recipe, i) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={i}
                  onClick={() => setSelectedRecipe(recipe)}
                  onSave={() => toggleSave(recipe.id)}
                  onDelete={() => handleDeleteRecipe(recipe.id)}
                />
              ))}
            </div>
            {filteredRecipes.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-display">No recipes found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </>
      )}

      {activeTab === "cookbooks" && (
        <main className="container mx-auto px-4 py-10">
          <CookbooksSection savedRecipes={savedRecipes} />
        </main>
      )}

      {activeTab === "planner" && (
        <main className="container mx-auto px-4 py-10">
          <MealPlanner recipes={recipes} />
        </main>
      )}

      {activeTab === "community" && (
        <main className="container mx-auto px-4 py-10">
          <CommunityFeed recipes={recipes} onRecipeClick={setSelectedRecipe} />
        </main>
      )}

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onSave={() => toggleSave(selectedRecipe.id)}
          />
        )}
        {showCreate && (
          <CreateRecipeDialog
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreateRecipe}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
