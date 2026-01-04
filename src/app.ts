import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import { questionRoutes } from "./routes/question-routes.js";
import { quizRoutes } from "./routes/quiz-routes.js";
import { connectDatabase } from "./database/connection.js";
import { requestTypeValidate, apiNotFound, jsonApiErrorHandler } from "./middlewares/jsonapi-middleware.js";
import { swaggerSpec } from "./config/swagger.js";

export const createApp = () => {

    const appServer = express();

    appServer.use(cors());
    appServer.use(bodyParser.json({ limit: '10mb' }));
    appServer.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    appServer.use(requestTypeValidate);

    appServer.use(questionRoutes);
    appServer.use(quizRoutes);

    appServer.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    appServer.use(apiNotFound);
    appServer.use(jsonApiErrorHandler);

    connectDatabase();

    return appServer;
}