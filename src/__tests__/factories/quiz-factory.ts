import { faker } from '@faker-js/faker';
import { type IQuiz, QuizModel } from '../../models/quiz-model.js';

export class QuizFactory {  
    static async createQuiz(overrides: Partial<IQuiz> = {}) {        
        const quizData: Partial<IQuiz> = {
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            instruction: faker.lorem.paragraph(),
            ...overrides,
        };
        
        return QuizModel.create(quizData);
    }
}