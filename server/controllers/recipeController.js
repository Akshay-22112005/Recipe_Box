import Recipe from "../models/Recipe.js";
export async function getAllRecipes(req, res) {
  try {
    const { search, tags, difficulty, maxTime, sort } = req.query;
    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { "ingredients.name": regex },
        { tags: regex },
      ];
    }
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      filter.tags = { $all: tagList };
    }

    if (difficulty && difficulty !== "All") {
      filter.difficulty = difficulty;
    }

    if (maxTime) {
      filter.$expr = {
        $lte: [{ $add: ["$prepTime", "$cookTime"] }, Number(maxTime)],
      };
    }

    let sortObj = { createdAt: -1 };
    if (sort === "rating") sortObj = { rating: -1 };
    if (sort === "quickest") sortObj = { prepTime: 1, cookTime: 1 };

    const recipes = await Recipe.find(filter).sort(sortObj).lean();

    if (sort === "quickest") {
      recipes.sort(
        (a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime)
      );
    }

    const result = recipes.map((r) => ({
      ...r,
      id: r._id.toString(),
      createdAt: r.createdAt
        ? new Date(r.createdAt).toISOString().split("T")[0]
        : undefined,
      _id: undefined,
      __v: undefined,
      ratingTotal: undefined,
      updatedAt: undefined,
    }));

    res.json(result);
  } catch (err) {
    console.error("GET /api/recipes error:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
export async function getRecipeById(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe.toJSON());
  } catch (err) {
    console.error("GET /api/recipes/:id error:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
}
export async function createRecipe(req, res) {
  try {
    const body = req.body;
    const ingredients =
      typeof body.ingredients === "string"
        ? JSON.parse(body.ingredients)
        : body.ingredients || [];
    const instructions =
      typeof body.instructions === "string"
        ? JSON.parse(body.instructions)
        : body.instructions || [];
    const tags =
      typeof body.tags === "string" ? JSON.parse(body.tags) : body.tags || [];
    const nutritionalInfo =
      typeof body.nutritionalInfo === "string"
        ? JSON.parse(body.nutritionalInfo)
        : body.nutritionalInfo;

    let image = body.image || "/placeholder.svg";
    let imagePublicId = "";

    if (req.file) {
      image = req.file.path || `/uploads/${req.file.filename}`;
      imagePublicId = req.file.filename || "";
    }

    const recipe = await Recipe.create({
      title: body.title,
      description: body.description,
      image,
      imagePublicId,
      ingredients,
      instructions,
      tags,
      prepTime: Number(body.prepTime) || 0,
      cookTime: Number(body.cookTime) || 0,
      servings: Number(body.servings) || 1,
      difficulty: body.difficulty || "Easy",
      authorId: body.authorId || "current-user",
      authorName: body.authorName || "You",
      nutritionalInfo,
    });
    res.status(201).json(recipe.toJSON());
  } catch (err) {
    console.error("POST /api/recipes error:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}
export async function updateRecipe(req, res) {
  try {
    const body = req.body;
    const updates = { ...body };
    if (typeof updates.ingredients === "string")
      updates.ingredients = JSON.parse(updates.ingredients);
    if (typeof updates.instructions === "string")
      updates.instructions = JSON.parse(updates.instructions);
    if (typeof updates.tags === "string")
      updates.tags = JSON.parse(updates.tags);
    if (typeof updates.nutritionalInfo === "string")
      updates.nutritionalInfo = JSON.parse(updates.nutritionalInfo);

    if (req.file) {
      updates.image = req.file.path || `/uploads/${req.file.filename}`;
      updates.imagePublicId = req.file.filename || "";
    }
    if (updates.prepTime) updates.prepTime = Number(updates.prepTime);
    if (updates.cookTime) updates.cookTime = Number(updates.cookTime);
    if (updates.servings) updates.servings = Number(updates.servings);

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe.toJSON());
  } catch (err) {
    console.error("PUT /api/recipes/:id error:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
}
export async function deleteRecipe(req, res) {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("DELETE /api/recipes/:id error:", err);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
}
export async function rateRecipe(req, res) {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    recipe.ratingTotal += rating;
    recipe.ratingCount += 1;
    recipe.rating =
      Math.round((recipe.ratingTotal / recipe.ratingCount) * 10) / 10;
    await recipe.save();

    res.json(recipe.toJSON());
  } catch (err) {
    console.error("PUT /api/recipes/:id/rate error:", err);
    res.status(500).json({ error: "Failed to rate recipe" });
  }
}
export async function addComment(req, res) {
  try {
    const { userId, userName, text } = req.body;
    if (!text)
      return res.status(400).json({ error: "Comment text is required" });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    recipe.comments.push({
      userId: userId || "anonymous",
      userName: userName || "Anonymous",
      text,
    });
    await recipe.save();
    res.status(201).json(recipe.toJSON());
  } catch (err) {
    console.error("POST /api/recipes/:id/comments error:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
}
