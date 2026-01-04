import { QuestionService } from "../../../services/question-service.js";
import { QuestionModel } from "../../../models/question-model.js";
import { QuestionFactory } from "../../factories/question-factory.js";
import { Types } from "mongoose";
import { type QuestionType } from "../../../models/question-model.js";

describe('QuestionService Unit Tests', () => {
    describe('getQuizzes', () => {
        it('should return empty array when no questions', async () => {
            const questions = await QuestionService.getQuestions();
            
            expect(questions).toBeArray();
            expect(questions).toBeEmpty();
            expect(questions.length).toBe(0);
        });
        Object
        it('should return all questions', async () => {
            for (let i = 1; i <= 3; i++) {
                await QuestionFactory.createQuestion({ 
                    text: `Question ${i}`,
                    type: 'free-text' as QuestionType,
                    correctAnswer: 'answer',
                    explanation: 'this is explanation',
                    timeLimit: 10,
                    quizId: new Types.ObjectId('507f1f77bcf86cd799439011')
                });
            }
            
            const questions = await QuestionService.getQuestions();
            
            expect(questions).toHaveLength(2);
            expect(questions.length).toBe(3);
        });
    });

    describe('getQuizById', () => {
        it('should return question by ID', async () => {
            const quesion = await QuestionFactory.createQuestion({ 
                text: 'Question',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011')
            });
            
            const result = await QuestionService.getQuestionById(
                quesion._id.toString()
            );
            
            expect(result._id.toString()).toBe(quesion._id.toString());
            expect(result.text).toBe('Question');
            expect(result.type).toBe('free-text');
        });
        
        it('should throw error for non-existent quiz', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            await expect(
                QuestionService.getQuestionById(fakeId)
            ).rejects.toThrow('Question not found');
        });
    });

    describe('createQuestion', () => {
        it('should create a new quiz', async () => {
            const questionData = {
                text: 'Question',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011')
            };
            
            const result = await QuestionService.createQuestion(questionData);
            
            expect(result.text).toBe('Question');
            
            const savedQuiz = await QuestionModel.findById(result._id);
            expect(savedQuiz).toBeDefined();
            expect(savedQuiz?.text).toBe('Question');
        });
    });

    describe('updateQuiz', () => {
        it('should update quiz data', async () => {
            const quiz = await QuestionFactory.createQuestion({ 
                text: 'Question',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011')
            });

            const updateData = {
                text: 'Updated Question'
            };

            const result = await QuestionService.updateQuestion(
                quiz._id.toString(),
                updateData,
            );

            expect(result.text).toBe('Updated Question');
            expect(result.updatedAt).not.toBe(quiz.updatedAt);
        });
    });
    
    describe('deleteQuiz', () => {
        it('should delete quiz and its questions', async () => {
            const quiz = await QuestionFactory.createQuestion({ 
                text: 'Question',
                type: 'free-text' as QuestionType,
                correctAnswer: 'answer',
                explanation: 'this is explanation',
                timeLimit: 10,
                quizId: new Types.ObjectId('507f1f77bcf86cd799439011'),
            });

            await QuestionService.deleteQuestion(quiz._id.toString());

            const deletedQuestion = await QuestionModel.findById(quiz._id);
            expect(deletedQuestion).toBeNull();
        });
    });
})