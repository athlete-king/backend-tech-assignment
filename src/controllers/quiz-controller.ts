import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QuizService } from "../services/quiz-service.js";
import { JsonApiBuilder } from "../utils/jsonapi-builder.js";

export class QuizController {
  static async createQuiz(req: Request, res: Response) {
    try {
      const { data } = req.body;
      if(!data || !data.attributes) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Bad request",
              detail: `Invalid JSON:API document.`
            }
          ]
        })
      }

      const quiz = await QuizService.createQuiz(data.attributes);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      const resource = JsonApiBuilder.documentToResource(
        quiz,
        'quizzes',
        {
          'title': 'title',
          'description': 'description',
          'instruction': 'instruction'
        }
      )

      resource.links = {
        self: `${baseUrl}/${quiz._id}`
      };

      builder.addResource(resource);

      res.setHeader('Location', `${baseUrl}/${quiz._id}`);
      res.status(StatusCodes.CREATED).json(builder.build());
    } 
    catch(err: any) {      
      if(err.message == 'Validate error') {
        res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Bad request",
              detail: `Invalid data`
            }
          ]
        })
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while creating the quiz: ${err}`
          }
        ]
      });
    }
  }

  static async getQuizById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const quiz = await QuizService.getQuizById(id);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      const resource = JsonApiBuilder.documentToResource(
        quiz,
        'quizzes',
        {
          'title': 'title',
          'description': 'description',
          'instruction': 'instruction'
        }
      );

      resource.links = {
        self: `${baseUrl}/${quiz._id}`
      };

      builder.addResource(resource);

      res.status(StatusCodes.OK).json(builder.build());
    }
    catch(err: any) {
      if(err.message == 'Quiz not found') {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Quiz with id ${req.params.id} not found`
            }
          ]
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while getting the quiz: ${err}`
          }
        ]
      });
    }
  }

  static async getQuizzes(req: Request, res: Response) {
    try {
      const quizzes = await QuizService.getQuizzes();

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      quizzes.forEach(quiz => {
        const resource = JsonApiBuilder.documentToResource(
          quiz,
          'quizzes',
          {
            'title': 'title',
            'description': 'description',
            'instruciton': 'instruciton'
          }
        );

        resource.links = {
          self: `${baseUrl}/${quiz._id}`
        };

        builder.addResource(resource);
      });

      res.status(StatusCodes.OK).json(builder.build());
    }
    catch(err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while getting the quizzes: ${err}`
          }
        ]
      });
    }
  }

  static async updateQuiz(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data } = req.body;

      if (!data || !data.attributes || data.id !== id) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Bad request",
              detail: `Invalid JSON:API document.`
            }
          ]
        })
      }

      const quiz = await QuizService.updateQuiz(id, data.attributes);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      const resource = JsonApiBuilder.documentToResource(
        quiz,
        'quizzes',
        {
          'title': 'title',
          'description': 'description',
          'instruction': 'instruction'
        }
      );

      resource.links = {
        self: `${baseUrl}/${quiz._id}`
      };

      builder.addResource(resource);
      res.status(StatusCodes.OK).json(builder.build());
    }
    catch(err: any) {
      if(err.message == 'Quiz not found') {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Quiz with id ${req.params.id} not found`
            }
          ]
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while updating the quiz: ${err}`
          }
        ]
      });
    }
  }

  static async deleteQuiz(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await QuizService.deleteQuiz(id);
      
      res.status(StatusCodes.NO_CONTENT).json();
    }
    catch(err: any) {
      if(err.message == 'Quiz not found') {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Quiz with id ${req.params.id} not found`
            }
          ]
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while deleting the quiz: ${err}`
          }
        ]
      });
    }
  }

  static async getQuizQuestions(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const questions = await QuizService.getQuizQuestion(id);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      questions.forEach(question => {
        const resource = JsonApiBuilder.documentToResource(
          question,
          'questions',
          {
            'text': 'text',
            'type': 'type',
            'choices': 'choices',
            'explanation': 'explanation',
            'timeLimit': 'timeLimit'
          },
          {
            'quizId': 'quizId'
          }
        );

        resource.links = {
          self: `${baseUrl}/${question._id}`
        };

        builder.addResource(resource);
      });

      res.status(StatusCodes.OK).json(builder.build());
    }
    catch(err: any) {
      if(err.message == 'Quiz not found') {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Quiz with id ${req.params.id} not found`
            }
          ]
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while deleting the quiz: ${err}`
          }
        ]
      });
    }
  }
}