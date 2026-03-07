import { useState } from "react";
import { motion } from "framer-motion";
import { X, Clock, Users, Star, Bookmark, ChefHat, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types/recipe";

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
  onSave: () => void;
}

const RecipeDetail = ({ recipe, onClose, onSave }: RecipeDetailProps) => {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");
  const [userRating, setUserRating] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 backdrop-blur-sm p-4 pt-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-3xl bg-background rounded-2xl overflow-hidden mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-2 mb-3">
              {recipe.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
              {recipe.title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ChefHat className="h-4 w-4 text-primary" />
              {recipe.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.prepTime + recipe.cookTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </span>
            <span className="flex items-center gap-1.5 text-warm">
              <Star className="h-4 w-4" fill="currentColor" />
              {recipe.rating} ({recipe.ratingCount})
            </span>
            <Button size="sm" variant="outline" onClick={onSave} className="ml-auto gap-1.5">
              <Bookmark className="h-4 w-4" fill={recipe.isSaved ? "currentColor" : "none"} />
              {recipe.isSaved ? "Saved" : "Save"}
            </Button>
          </div>

          <p className="text-muted-foreground font-body mb-6">{recipe.description}</p>

          {recipe.nutritionalInfo && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Calories", value: recipe.nutritionalInfo.calories, unit: "kcal" },
                { label: "Protein", value: recipe.nutritionalInfo.protein, unit: "g" },
                { label: "Carbs", value: recipe.nutritionalInfo.carbs, unit: "g" },
                { label: "Fat", value: recipe.nutritionalInfo.fat, unit: "g" },
              ].map((n) => (
                <div key={n.label} className="text-center p-3 rounded-xl bg-muted">
                  <div className="text-lg font-bold text-foreground">{n.value}<span className="text-xs text-muted-foreground ml-0.5">{n.unit}</span></div>
                  <div className="text-xs text-muted-foreground">{n.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-1 mb-6 border-b">
            {(["ingredients", "instructions"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "ingredients" ? (
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="font-medium text-foreground">{ing.name}</span>
                  <span className="text-muted-foreground ml-auto text-sm">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-lg hover:bg-muted transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-foreground pt-1">{step}</p>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-8 pt-6 border-t">
            <h4 className="font-display text-lg font-semibold mb-3">Rate this recipe</h4>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setUserRating(star)}>
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= userRating ? "text-warm" : "text-muted"
                    }`}
                    fill={star <= userRating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeDetail;
