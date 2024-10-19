import { Router } from "express";
import {
  getUserSubscriptions,
  subscribeToQuestion,
  unsubscribeFromQuestion,
} from "../controllers/subscription.controller";

const router = Router();

// Route to subscribe a user to a question
router.post("/subscribe", subscribeToQuestion);
// Route to unsubscribe a user from a question
router.post("/unsubscribe", unsubscribeFromQuestion);
// Route to get all subscriptions of a user
router.get("/:userId/subscriptions", getUserSubscriptions);

export default router;
