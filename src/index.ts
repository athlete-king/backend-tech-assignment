import express from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import { questionRoutes } from "./routes/question-routes.js";
import { quizRoutes } from "./routes/quiz-routes.js";
import { connectDatabase } from "./database/connection.js";

dotenv.config();

const appServer = express();

appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({ extended: true }));

appServer.use(questionRoutes);
appServer.use(quizRoutes);

connectDatabase();

const PORT = process.env.PORT ?? 3000;

appServer.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});