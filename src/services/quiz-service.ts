import { type IQuiz, QuizModel } from '../models/quiz-model.js';
import { QuestionModel } from '../models/question-model.js';

export class QuizService {
    static async createQuiz(quizData: Partial<IQuiz>) {
        const { title, instruction, description } = quizData;

        if(!title || !instruction || !description) {
            throw new Error("Validate error");
        }

        const quiz = await QuizModel.create(quizData);

        return quiz;
    }

    static async getQuizById(id: string) {
        const quiz = await QuizModel.findById(id);

        if(!quiz) {
            throw new Error('Quiz not found');
        }

        return quiz;
    }

    static async getQuizzes() {
        const quizzes = await QuizModel.find();

        return quizzes;
    }

    static async updateQuiz(id: string, updateData: Partial<IQuiz>) {
        const quiz = await QuizModel.findById(id);
        
        if(!quiz) {
            throw new Error('Quiz not found');
        }

        const { author, createdAt, _id, ...safeUpdateData } = updateData as any;

        Object.assign(quiz, safeUpdateData);
        quiz.updatedAt = new Date();

        await quiz.save();
        
        return quiz;
    }

    static async deleteQuiz(id: string) {  
        const quiz = await QuizModel.findById(id);
    
        if(!quiz) {
            throw new Error('Quiz not found');
        }

        await QuestionModel.deleteMany({ quizId: id });
        
        await QuizModel.findByIdAndDelete(id);
        
        return true;
    }

    static async getQuizQuestion(id: string) {
        const quiz = await QuizModel.findById(id);

        if(!quiz) {
            throw new Error('Quiz not found');
        }

        const questions = await QuestionModel.find({ quizId: id });

        return questions;
    }
}