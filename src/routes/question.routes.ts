import express from "express";
import {
  createQuestion,
  getQuestions,
} from "../controllers/question.controller";
import { isAuthenticated } from "../middleware/auth";
import {
  createAnswer,
  deleteAnswer,
  downvoteAnswer,
  getAnswersForQuestion,
  upvoteAnswer,
} from "../controllers/answer.controller";

const router = express.Router();
router.post("/", isAuthenticated, createQuestion);
router.get("/", isAuthenticated, getQuestions);
router.post("/answers/:answerId/upvote", isAuthenticated, upvoteAnswer);
router.post("/answers/:answerId/downvote", isAuthenticated, downvoteAnswer);
// Answer Routes
router.post("/:questionId/answers", isAuthenticated, createAnswer); // Create an answer
router.get("/:questionId/answers", isAuthenticated, getAnswersForQuestion); // Get answers for a specific question
router.delete("/answers/:answerId", isAuthenticated, deleteAnswer); // Delete an answer

export default router;
