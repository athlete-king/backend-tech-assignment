import { type IQuestion, QuestionModel } from "../models/question-model.js";

export class QuestionService {
    static async createQuestion(questionData: Partial<IQuestion>) {
        const { text, type, choices, correctAnswer, explanation, timeLimit, quizId  } = questionData;

        if(!text || !type || !correctAnswer || !explanation || !timeLimit || !quizId) {
            throw new Error('Validate error');
        }

        if(type === "multiple-choice" && (!choices || !Array.isArray(choices))) {
            throw new Error('Validate error');
        }

        if(type === "free-text") {
            const question = await QuestionModel.create({
                text, type, correctAnswer, explanation, timeLimit, quizId
            });

            return question;
        }

        const question = await QuestionModel.create({
            text, type, choices, correctAnswer, explanation, timeLimit, quizId
        });

        return question;
    }

    static async getQuestionById(id: string) {
        const question = await QuestionModel
                        .findById(id)
                        .populate('quiz', ['title', 'instruction', 'description']);

        if(!question) {
            throw new Error('Quesion not found');
        }

        return question;
    }

    static async getQuestions() {
        const questions = await QuestionModel
                        .find()
                        .populate('quiz', ['title', 'instruction', 'description']);
        return questions;
    }

    static async updateQuestion(id: string, updateData: Partial<IQuestion>) {
        const question = await QuestionModel.findById(id);

        if(!question) {
            throw new Error('Question not found');
        }

        const { quiz, createdAt, _id, ...safeUpdateData } = updateData as any;

        Object.assign(quiz, safeUpdateData);
        question.updatedAt = new Date();

        await question.save();
        
        return question;
    }

    static async deleteQuestion(id: string) {
        const question = await QuestionModel.findById(id);

        if(!question) {
            throw new Error('Question not found');
        }

        await QuestionModel.findByIdAndDelete(id);
                
        return true;
    }
}