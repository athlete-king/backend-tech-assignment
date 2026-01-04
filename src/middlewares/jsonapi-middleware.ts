import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { QuizValidator } from "../models/quiz-model.js";
import { QuestionValidator } from "../models/question-model.js";

export const requestTypeValidate  = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {
    const contentType = req.get('Content-Type');
    const accept = req.get('Accept');
    if ((req.method === 'POST' || req.method === 'PATCH') && 
        contentType !== 'application/vnd.api+json') {
        res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
            errors: [
                {
                    status: StatusCodes.UNSUPPORTED_MEDIA_TYPE.toString(),
                    title: 'Unsupported Media Type',
                    detail: 'Content-Type must be application/vnd.api+json'
                }
            ]
        });
    }
    
    if (accept && !accept.includes('application/vnd.api+json')) {
        res.status(StatusCodes.NOT_ACCEPTABLE).json({
            errors: [
                {
                    status: StatusCodes.NOT_ACCEPTABLE.toString(),
                    title: 'Not Acceptable',
                    detail: 'Accept header must include application/vnd.api+json'
                }
            ]
        });
    }
  }
  next();
}

export const apiNotFound = (
  req: Request,
  res: Response
): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    errors: [
      {
        status: StatusCodes.NOT_FOUND.toString(),
        title: 'Not Found',
        detail: `Route ${req.method} ${req.path} not found`
      }
    ]
  })
}

export const jsonApiErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('JSON:API Error:', error);

  const status = error.status || 500;
  const errors = Array.isArray(error.errors) ? error.errors : [{
    status: status.toString(),
    title: error.name || 'Internal Server Error',
    detail: error.message || 'An unexpected error occurred',
    code: error.code || 'INTERNAL_ERROR',
    ...(error.meta && { meta: error.meta })
  }];

  res.status(status).json({
    jsonapi: { version: '1.1' },
    errors
  });
};

export const validateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { data } = req.body;
  
  if (!data || !data.attributes) {
    return next({
      status: 400,
      title: 'Bad Request',
      detail: 'Invalid JSON:API document'
    });
  }

  const quiz = plainToInstance(QuizValidator, data.attributes);
  const errors = await validate(quiz);

  if (errors.length > 0) {
    const jsonApiErrors = errors.map((error: ValidationError) => ({
      status: StatusCodes.UNPROCESSABLE_ENTITY.toString(),
      title: 'Validation Error',
      detail: Object.values(error.constraints || {}).join(', '),
      source: {
        pointer: `/data/attributes/${error.property}`
      }
    }));

    return next({
      status: 422,
      errors: jsonApiErrors
    });
  }

  next();
};

export const validateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { data } = req.body;
  
  if (!data || !data.attributes) {
    return next({
      status: 400,
      title: 'Bad Request',
      detail: 'Invalid JSON:API document'
    });
  }

  const quiz = plainToInstance(QuestionValidator, data.attributes);
  const errors = await validate(quiz);

  if (errors.length > 0) {
    const jsonApiErrors = errors.map((error: ValidationError) => ({
      status: StatusCodes.UNPROCESSABLE_ENTITY.toString(),
      title: 'Validation Error',
      detail: Object.values(error.constraints || {}).join(', '),
      source: {
        pointer: `/data/attributes/${error.property}`
      }
    }));

    return next({
      status: 422,
      errors: jsonApiErrors
    });
  }

  next();
};