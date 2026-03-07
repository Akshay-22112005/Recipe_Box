import mongoose from "mongoose";
const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String, default: "" },
  },
  { _id: false }
);
const nutritionalInfoSchema = new mongoose.Schema(
  {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  { _id: false }
);
const commentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "/placeholder.svg" },
    imagePublicId: { type: String, default: "" },
    ingredients: [ingredientSchema],
    instructions: [String],
    tags: [String],
    prepTime: { type: Number, default: 0 },
    cookTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    authorId: { type: String, default: "anonymous" },
    authorName: { type: String, default: "Anonymous" },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    ratingTotal: { type: Number, default: 0 },
    comments: [commentSchema],
    nutritionalInfo: nutritionalInfoSchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        ret.createdAt = ret.createdAt
          ? new Date(ret.createdAt).toISOString().split("T")[0]
          : undefined;
        delete ret._id;
        delete ret.__v;
        delete ret.ratingTotal;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);
const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;