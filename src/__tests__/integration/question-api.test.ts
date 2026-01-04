import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../app.js';
import { QuestionFactory } from '../factories/question-factory.js';
import { type QuestionType } from "../../models/question-model.js";
import { Types } from "mongoose";

describe('Question API Tests', () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();
    });

    describe('GET /questions', () => {
        it('should return empty array when no quizzes exist', async () => {
            const response = await request(app)
                .get('/questions')
                .set('Accept', 'application/vnd.api+json') 
                .expect('Content-Type', /json/) 
                .expect(200); 
            
            expect(response.body).toBeJsonApiCompliant();
            expect(response.body.data).toBeArray();
            expect(response.body.data).toBeEmpty(); 
            
            expect(response.body.jsonapi).toBeDefined();
            expect(response.body.jsonapi.version).toBe('1.1');
        });
        
        it('should return quizzes when they exist', async () => {
            await QuestionFactory.createQuestion({ 
                text: 'Question 1',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011') 
            });
            await QuestionFactory.createQuestion({
                text: 'Question 2',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011') 
            });
            
            const response = await request(app)
                .get('/questions')
                .set('Accept', 'application/vnd.api+json')
                .expect(200);
            
            expect(response.body.data).toBeArray();
            expect(response.body.data).toHaveLength(2);
            
            response.body.data.forEach((question: any) => {
                expect(question).toHaveProperty('type', 'questions');
                expect(question).toHaveProperty('id');
                expect(question).toHaveProperty('attributes');
                expect(question.attributes).toHaveProperty('text');
                expect(question.attributes).toHaveProperty('type');
            });
        });
    });

    describe('GET /questions/:id', () => {
        it('should return a single quiz by ID', async () => {
            const question = await QuestionFactory.createQuestion({ 
                text: 'Question',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011') 
            });
            
            const response = await request(app)
                .get(`/questions/${question._id}`)
                .set('Accept', 'application/vnd.api+json')
                .expect(200);
            
            expect(response.body.data).toBeObject(); 
            expect(response.body.data.id).toBe(question._id.toString());
            expect(response.body.data.type).toBe('questions');
            expect(response.body.data.attributes.text).toBe('Question');
            expect(response.body.data.attributes.timeLimit).toBe(10);
        });
        
        it('should return 404 for non-existent quiz', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            const response = await request(app)
                .get(`/questions/${fakeId}`)
                .set('Accept', 'application/vnd.api+json')
                .expect(404); 
            
            expect(response.body.errors).toBeArray();
            expect(response.body.errors[0].status).toBe('404');
            expect(response.body.errors[0].title).toContain('Not Found');
        });
    });

    describe('POST /questions', () => {
        it('should create a new quiz', async () => {
            const requestBody = {
                data: {
                    type: 'questions',
                    attributes: {
                        text: 'My first Question',
                        type: 'free-text' as QuestionType,
                        correctAnswer: 'answer',
                        explanation: 'this is explanation',
                        timeLimit: 10,
                        quizId: new Types.ObjectId('507f1f77bcf86cd799439011') 
                    },
                },
            };
          
            const response = await request(app)
                .post('/questions')
                .set('Accept', 'application/vnd.api+json')
                .set('Content-Type', 'application/vnd.api+json') 
                .send(requestBody)
                .expect(201); 
            
            expect(response.body.data.type).toBe('questions');
            expect(response.body.data.attributes.text).toBe('My first Question');
            
            expect(response.headers.location).toBeDefined();
            expect(response.headers.location).toMatch(/\/api\/questions\/[a-f0-9]+$/);
        });
        
        it('should validate required fields', async () => {
            const invalidRequestBody = {
                data: {
                    type: 'questions',
                    attributes: {
                        text: 'My first Question',
                        type: 'free-text' as QuestionType,
                        correctAnswer: 'answer',
                        explanation: 'this is explanation',
                        quizId: new Types.ObjectId('507f1f77bcf86cd799439011') 
                    },
                },
            };
            
            const response = await request(app)
                .post('/questions')
                .set('Accept', 'application/vnd.api+json')
                .set('Content-Type', 'application/vnd.api+json')
                .send(invalidRequestBody)
                .expect(422); 
            
            expect(response.body.errors).toBeArray();
            expect(response.body.errors[0].status).toBe('422');
            expect(response.body.errors[0].title).toContain('Validation');
        });
    });

    describe('PATCH /questions/:id', () => {
        it('should update an existing quiz', async () => {
            const question = await QuestionFactory.createQuestion({ 
                text: 'My first Question',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011') 
            });
            
            const updateBody = {
                data: {
                    type: 'questions',
                    id: question._id.toString(),
                    attributes: {
                        text: 'My first Updated Question'
                    },
                },
            };
            
            const response = await request(app)
                .patch(`/questions/${question._id}`)
                .set('Accept', 'application/vnd.api+json')
                .set('Content-Type', 'application/vnd.api+json')
                .send(updateBody)
                .expect(200);
            
            expect(response.body.data.attributes.text).toBe('My first Updated Question');
        });
    });

    describe('DELETE /questions/:id', () => {
        it('should delete a quiz', async () => {
            const question = await QuestionFactory.createQuestion();
            
            await request(app)
                .delete(`/questions/${question._id}`)
                .set('Accept', 'application/vnd.api+json')
                .expect(204); 
            
            await request(app)
                .get(`/questions/${question._id}`)
                .set('Accept', 'application/vnd.api+json')
                .expect(404);
        });
    });
})