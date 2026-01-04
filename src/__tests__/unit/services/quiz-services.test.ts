import { QuizService } from '../../../services/quiz-service.js';
import { QuizModel } from '../../../models/quiz-model.js';
import { QuizFactory } from '../../factories/quiz-factory.js';
import { QuestionModel } from '../../../models/question-model.js';

describe('QuizService Unit Tests', () => {
    describe('getQuizzes', () => {
        it('should return empty array when no quizzes', async () => {
            const quizzes = await QuizService.getQuizzes();
            
            expect(quizzes).toBeArray();
            expect(quizzes).toBeEmpty();
            expect(quizzes.length).toBe(0);
        });
        
        it('should return all quizzes', async () => {
            for (let i = 1; i <= 3; i++) {
                await QuizFactory.createQuiz({ 
                title: `Quiz ${i}`,
                });
            }
            
            const quizzes = await QuizService.getQuizzes();
            
            expect(quizzes).toHaveLength(2);
            expect(quizzes.length).toBe(3);
        });
    });
  
    describe('getQuizById', () => {
        it('should return quiz by ID', async () => {
            const quiz = await QuizFactory.createQuiz({ 
                title: 'Test Quiz'
            });
            
            const result = await QuizService.getQuizById(
                quiz._id.toString()
            );
            
            expect(result._id.toString()).toBe(quiz._id.toString());
            expect(result.title).toBe('Test Quiz');
        });
        
        it('should throw error for non-existent quiz', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            await expect(
                QuizService.getQuizById(fakeId)
            ).rejects.toThrow('Quiz not found');
        });
    });
  
    describe('createQuiz', () => {
        it('should create a new quiz', async () => {
            const quizData = {
                title: 'New Quiz',
                description: 'Test description',
                instruction: 'Test instruciton'
            };
            
            const result = await QuizService.createQuiz(quizData);
            
            expect(result.title).toBe('New Quiz');
            
            const savedQuiz = await QuizModel.findById(result._id);
            expect(savedQuiz).toBeDefined();
            expect(savedQuiz?.title).toBe('New Quiz');
        });
    });

    describe('updateQuiz', () => {
        it('should update quiz data', async () => {
            const quiz = await QuizFactory.createQuiz({ 
                title: 'Original',
            });

            const updateData = {
                title: 'Updated',
            };

            const result = await QuizService.updateQuiz(
                quiz._id.toString(),
                updateData,
            );

            expect(result.title).toBe('Updated');
            expect(result.updatedAt).not.toBe(quiz.updatedAt);
        });
    });

    describe('deleteQuiz', () => {
        it('should delete quiz and its questions', async () => {
             const quiz = await QuizFactory.createQuiz({ 
                title: 'Original',
            });

            await QuizService.deleteQuiz(quiz._id.toString());

            const deletedQuiz = await QuizModel.findById(quiz._id);
            expect(deletedQuiz).toBeNull();
            
            const questions = await QuestionModel.find({ quiz: quiz._id });
            expect(questions).toHaveLength(0);
        });
    });
});