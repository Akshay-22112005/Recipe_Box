import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FolderOpen, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Recipe } from "@/types/recipe";

interface Cookbook {
  id: string;
  name: string;
  recipes: Recipe[];
}

interface CookbooksSectionProps {
  savedRecipes: Recipe[];
}

const CookbooksSection = ({ savedRecipes }: CookbooksSectionProps) => {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([
    { id: "1", name: "Sunday Brunch Ideas", recipes: [] },
    { id: "2", name: "Quick Weeknight Dinners", recipes: [] },
  ]);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [activeCookbook, setActiveCookbook] = useState<string | null>(null);

  const createCookbook = () => {
    if (!newName.trim()) return;
    setCookbooks([...cookbooks, { id: Date.now().toString(), name: newName, recipes: [] }]);
    setNewName("");
    setShowCreate(false);
  };

  const addToCookbook = (cookbookId: string, recipe: Recipe) => {
    setCookbooks((prev) =>
      prev.map((cb) =>
        cb.id === cookbookId && !cb.recipes.find((r) => r.id === recipe.id)
          ? { ...cb, recipes: [...cb.recipes, recipe] }
          : cb
      )
    );
  };

  const active = cookbooks.find((cb) => cb.id === activeCookbook);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Your Cookbooks</h2>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Cookbook
        </Button>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Cookbook name"
            onKeyDown={(e) => e.key === "Enter" && createCookbook()}
          />
          <Button onClick={createCookbook}>Create</Button>
          <Button variant="outline" onClick={() => setShowCreate(false)}>
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {!activeCookbook ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cookbooks.map((cb, i) => (
            <motion.button
              key={cb.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveCookbook(cb.id)}
              className="p-6 rounded-xl bg-card border recipe-card-shadow text-left hover:border-primary/50 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold text-card-foreground">{cb.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {cb.recipes.length} recipe{cb.recipes.length !== 1 ? "s" : ""}
              </p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveCookbook(null)}
            className="text-sm text-primary hover:underline mb-4 flex items-center gap-1"
          >
            ← All Cookbooks
          </button>
          <h3 className="font-display text-xl font-bold mb-4">{active?.name}</h3>

          {active && active.recipes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No recipes yet. Save recipes and add them here!</p>
            </div>
          )}

          {active && active.recipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {active.recipes.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <img src={r.image} alt={r.title} className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-card-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.prepTime + r.cookTime} min</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {savedRecipes.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">Add from saved recipes</h4>
              <div className="flex flex-wrap gap-2">
                {savedRecipes
                  .filter((r) => !active?.recipes.find((ar) => ar.id === r.id))
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => addToCookbook(activeCookbook, r)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-muted transition-colors text-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {r.title}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CookbooksSection;
