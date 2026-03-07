import mongoose from "mongoose";
const slotSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    meal: { type: String, required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { _id: false }
);
const mealPlanSchema = new mongoose.Schema(
  {
    slots: [slotSchema],
  },
  { timestamps: true }
);
const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
export default MealPlan;
