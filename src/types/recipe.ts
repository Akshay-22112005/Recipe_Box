export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  authorId: string;
  authorName: string;
  rating: number;
  ratingCount: number;
  comments: Comment[];
  nutritionalInfo?: NutritionalInfo;
  createdAt: string;
  isSaved?: boolean;
}

export type TagFilter = string;
export type DifficultyFilter = "Easy" | "Medium" | "Hard" | "All";
export type SortOption = "newest" | "rating" | "quickest";
