import { Router } from "express";
import { QuestionController } from "../controllers/question-controller.js";
import { validateQuestion } from "../middlewares/jsonapi-middleware.js";

const router = Router();

router.post("/questions", validateQuestion, (_req, res) => {
  QuestionController.createQuestion(_req, res);
});

router.get("/questions/:id", (_req, res) => {
  QuestionController.getQuestionById(_req, res);
});

router.get("/questions", (_req, res) => {
  QuestionController.getQuestions(_req, res);
});

router.patch("/questions/:id", (_req, res) => {
  QuestionController.updateQuestion(_req, res);
});

router.delete("/questions/:id", (_req, res) => {
  QuestionController.deleteQuestion(_req, res);
});

export {router as questionRoutes};