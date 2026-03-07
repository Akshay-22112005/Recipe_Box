import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, UserPlus, UserCheck } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@/types/recipe";

interface CommunityFeedProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}
const CommunityFeed = ({ recipes, onRecipeClick }: CommunityFeedProps) => {
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const toggleFollow = (userId: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };
  const toggleLike = (recipeId: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });
  };
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Community Feed</h2>
      <div className="max-w-2xl mx-auto space-y-6">
        {recipes.map((recipe, i) => (
          <motion.article
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border overflow-hidden recipe-card-shadow"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                  {recipe.authorName[0]}
                </div>
                <div>
                  <p className="font-medium text-sm text-card-foreground">{recipe.authorName}</p>
                  <p className="text-xs text-muted-foreground">{recipe.createdAt}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(recipe.authorId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  following.has(recipe.authorId)
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {following.has(recipe.authorId) ? (
                  <><UserCheck className="h-3.5 w-3.5" /> Following</>
                ) : (
                  <><UserPlus className="h-3.5 w-3.5" /> Follow</>
                )}
              </button>
            </div>

            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full aspect-[4/3] object-cover cursor-pointer"
              onClick={() => onRecipeClick(recipe)}
            />

            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => toggleLike(recipe.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    liked.has(recipe.id) ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className="h-5 w-5" fill={liked.has(recipe.id) ? "currentColor" : "none"} />
                  <span className="text-sm">{recipe.ratingCount + (liked.has(recipe.id) ? 1 : 0)}</span>
                </button>
                <button
                  onClick={() => onRecipeClick(recipe)}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{recipe.comments.length}</span>
                </button>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors ml-auto">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <h3
                className="font-display text-lg font-semibold text-card-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => onRecipeClick(recipe)}
              >
                {recipe.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{recipe.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
