import { Router } from "express";
import { QuizController } from "../controllers/quiz-controller.js";
import { validateQuiz } from "../middlewares/jsonapi-middleware.js";

const router = Router();

router.post("/quizzes", validateQuiz, (_req, res) => {
  QuizController.createQuiz(_req, res);
});

router.get("/quizzes/:id", (_req, res) => {
  QuizController.getQuizById(_req, res);
});

router.get("/quizzes", (_req, res) => {
  QuizController.getQuizzes(_req, res);
});

router.get("/quizzes/:id/questions", (_req, res) => {
  QuizController.getQuizQuestions(_req, res);
})

router.patch("/quizzes/:id", (_req, res) => {
  QuizController.updateQuiz(_req, res);
});

router.delete("/quizzes/:id", (_req, res) => {
  QuizController.deleteQuiz(_req, res);
});

export { router as quizRoutes };