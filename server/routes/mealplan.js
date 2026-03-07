import { Router } from "express";
import { getMealPlan, saveMealPlan } from "../controllers/mealPlanController.js";

const router = Router();

router.get("/", getMealPlan);
router.put("/", saveMealPlan);

export default router;
