import request from 'supertest'; 
import type { Express } from 'express';
import { createApp } from '../../app.js';
import { QuizFactory } from '../factories/quiz-factory.js';

describe('Quiz API Tests', () => {
  let app: Express;
  
  beforeAll(async () => {
    app = createApp(); 
  });
  
  describe('GET /quizzes', () => {
    it('should return empty array when no quizzes exist', async () => {
      const response = await request(app)
        .get('/quizzes')
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
      await QuizFactory.createQuiz({ title: 'Test Quiz 1' });
      await QuizFactory.createQuiz({ title: 'Test Quiz 2' });
      
      const response = await request(app)
        .get('/quizzes')
        .set('Accept', 'application/vnd.api+json')
        .expect(200);
      
      expect(response.body.data).toBeArray();
      expect(response.body.data).toHaveLength(2);
      
      response.body.data.forEach((quiz: any) => {
        expect(quiz).toHaveProperty('type', 'quizzes');
        expect(quiz).toHaveProperty('id');
        expect(quiz).toHaveProperty('attributes');
        expect(quiz.attributes).toHaveProperty('title');
      });
    });
  });
  
  describe('GET /quizzes/:id', () => {
    it('should return a single quiz by ID', async () => {
      const quiz = await QuizFactory.createQuiz({ 
        title: 'JavaScript Basics',
      });
      
      const response = await request(app)
        .get(`/quizzes/${quiz._id}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(200);
      
      expect(response.body.data).toBeObject(); 
      expect(response.body.data.id).toBe(quiz._id.toString());
      expect(response.body.data.type).toBe('quizzes');
      expect(response.body.data.attributes.title).toBe('JavaScript Basics');
    });
    
    it('should return 404 for non-existent quiz', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/quizzes/${fakeId}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(404); 
      
      expect(response.body.errors).toBeArray();
      expect(response.body.errors[0].status).toBe('404');
      expect(response.body.errors[0].title).toContain('Not Found');
    });
  });
  
  describe('POST /quizzes', () => {
    it('should create a new quiz', async () => {
      const requestBody = {
        data: {
          type: 'quizzes',
          attributes: {
            title: 'My First Quiz',
            description: 'This is my first quiz created via API',
            instruction: 'All questions are designed to develop your intelligence. Show off your skills.'
          },
        },
      };
      
      const response = await request(app)
        .post('/quizzes')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json') 
        .send(requestBody)
        .expect(201); 
      
      expect(response.body.data.type).toBe('quizzes');
      expect(response.body.data.attributes.title).toBe('My First Quiz');
      
      expect(response.headers.location).toBeDefined();
      expect(response.headers.location).toMatch(/\/api\/quizzes\/[a-f0-9]+$/);
    });
    
    it('should validate required fields', async () => {
      const invalidRequestBody = {
        data: {
          type: 'quizzes',
          attributes: {
            description: 'Missing title',
          },
        },
      };
      
      const response = await request(app)
        .post('/quizzes')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .send(invalidRequestBody)
        .expect(422); 
      
      expect(response.body.errors).toBeArray();
      expect(response.body.errors[0].status).toBe('422');
      expect(response.body.errors[0].title).toContain('Validation');
    });
  });
  
  describe('PATCH /quizzes/:id', () => {
    it('should update an existing quiz', async () => {
      const quiz = await QuizFactory.createQuiz({ 
        title: 'Original Title'
      });
      
      const updateBody = {
        data: {
          type: 'quizzes',
          id: quiz._id.toString(),
          attributes: {
            title: 'Updated Title'
          },
        },
      };
      
      const response = await request(app)
        .patch(`/quizzes/${quiz._id}`)
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .send(updateBody)
        .expect(200);
      
      expect(response.body.data.attributes.title).toBe('Updated Title');
    });
  });
  
  describe('DELETE /quizzes/:id', () => {
    it('should delete a quiz', async () => {
      const quiz = await QuizFactory.createQuiz();
      
      await request(app)
        .delete(`/quizzes/${quiz._id}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(204); 
      
      await request(app)
        .get(`/quizzes/${quiz._id}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(404);
    });
  });
});