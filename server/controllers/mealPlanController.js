import MealPlan from "../models/MealPlan.js";
import Recipe from "../models/Recipe.js";
export async function getMealPlan(_req, res) {
  try {
    let plan = await MealPlan.findOne().sort({ updatedAt: -1 }).lean();
    if (!plan) return res.json({ slots: [] });
    const recipeIds = [...new Set(plan.slots.map((s) => s.recipeId.toString()))];
    const recipes = await Recipe.find({ _id: { $in: recipeIds } }).lean();
    const recipeMap = Object.fromEntries(recipes.map((r) => [r._id.toString(), r]));
    const slots = plan.slots
      .filter((s) => recipeMap[s.recipeId.toString()])
      .map((s) => {
        const r = recipeMap[s.recipeId.toString()];
        return {
          day: s.day,
          meal: s.meal,
          recipe: {
            ...r,
            id: r._id.toString(),
            createdAt: r.createdAt
              ? new Date(r.createdAt).toISOString().split("T")[0]
              : undefined,
            _id: undefined,
            __v: undefined,
            ratingTotal: undefined,
            updatedAt: undefined,
          },
        };
      });

    res.json({ slots });
  } catch (err) {
    console.error("GET /api/mealplan error:", err);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
}
export async function saveMealPlan(req, res) {
  try {
    const { slots } = req.body;
    let plan = await MealPlan.findOne().sort({ updatedAt: -1 });
    if (plan) {
      plan.slots = slots || [];
      await plan.save();
    } else {
      plan = await MealPlan.create({ slots: slots || [] });
    }
    res.json({ message: "Meal plan saved", id: plan._id });
  } catch (err) {
    console.error("PUT /api/mealplan error:", err);
    res.status(500).json({ error: "Failed to save meal plan" });
  }
}
