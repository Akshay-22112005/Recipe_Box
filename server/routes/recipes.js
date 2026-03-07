import { Router } from "express";
import mongoose from "mongoose";
import upload from "../middleware/upload.js";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  addComment,
} from "../controllers/recipeController.js";
const router = Router();
// Validate :id is a valid MongoDB ObjectId
function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }
  next();
}
router.param("id", validateId);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", upload.single("image"), createRecipe);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);
router.put("/:id/rate", rateRecipe);
router.post("/:id/comments", addComment);

export default router;
