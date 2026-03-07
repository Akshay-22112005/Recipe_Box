import { motion } from "framer-motion";
import { Clock, Star, Bookmark, Users, Trash2 } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onClick: () => void;
  onSave: () => void;
  onDelete?: () => void;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-secondary text-secondary-foreground",
  Medium: "bg-warm text-warm-foreground",
  Hard: "bg-primary text-primary-foreground",
};

const RecipeCard = ({ recipe, index, onClick, onSave, onDelete }: RecipeCardProps) => {
  const isUserRecipe = recipe.authorId === "current-user" || recipe.authorName === "You";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group cursor-pointer recipe-card-shadow rounded-xl overflow-hidden bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColor[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {isUserRecipe && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 rounded-full bg-destructive/80 backdrop-blur-sm text-destructive-foreground hover:bg-destructive transition-colors"
              title="Delete recipe"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={`p-2 rounded-full transition-colors ${
              recipe.isSaved
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <Bookmark className="h-4 w-4" fill={recipe.isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-semibold text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-body">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings}
            </span>
          </div>
          <span className="flex items-center gap-1 text-warm">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
            {recipe.rating}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default RecipeCard;
