import { faker } from "@faker-js/faker";
import { type IQuestion, QuestionModel } from "../../models/question-model.js";

export class QuestionFactory {
    static async createQuestion(overrides: Partial<IQuestion> = {}) {
        const questionData: Partial<IQuestion> = {
            text: faker.lorem.words(5),
            type: faker.helpers.arrayElement(['free-text', 'multiple-choice']),
            explanation: faker.lorem.paragraph(),
            timeLimit: faker.number.int({ min: 10, max: 60 }),
            ...overrides
        }

        return QuestionModel.create(questionData);
    }
}