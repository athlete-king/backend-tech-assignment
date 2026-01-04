import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QuestionService } from "../services/question-service.js";
import { JsonApiBuilder } from "../utils/jsonapi-builder.js";

export class QuestionController {
  static async createQuestion(req: Request, res: Response) {
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

      const question = await QuestionService.createQuestion(data.attributes);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

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
      )

      resource.links = {
        self: `${baseUrl}/${question._id}`
      };

      builder.addResource(resource);

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
            detail: `An error occurred while deleting the question: ${err}`
          }
        ]
      });
    }
  }

  static async getQuestionById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const question = await QuestionService.getQuestionById(id);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

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

      res.status(StatusCodes.OK).json(builder.build());
    }
    catch(err: any) {
      if(err.message == "Quesion not found") {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Question with id ${req.params.id} not found`
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

  static async getQuestions(req: Request, res: Response) {
    try {
      const questions = await QuestionService.getQuestions();
      
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

  static async updateQuestion(req: Request, res: Response) {
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

      const question = await QuestionService.updateQuestion(id, data.attributes);

      const builder = new JsonApiBuilder();
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

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
      res.status(StatusCodes.OK).json(builder.build());
    }
    catch(err: any) {
      if(err.message == 'Question not found') {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Question with id ${req.params.id} not found`
            }
          ]
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while updating the question: ${err}`
          }
        ]
      });
    }
  }

  static async deleteQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await QuestionService.deleteQuestion(id);
      
      res.status(StatusCodes.NO_CONTENT).json();
    }
    catch(err: any) {
       if(err.message == 'Question not found') {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: 'Not Found',
              detail: `Question with id ${req.params.id} not found`
            }
          ]
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: `An error occurred while deleting the question: ${err}`
          }
        ]
      });
    }
  }
}