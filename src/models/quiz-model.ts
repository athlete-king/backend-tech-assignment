import { Schema, model, Document } from "mongoose";
import { IsString, MaxLength, MinLength } from "class-validator";

export class QuizValidator {
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    title!: string

    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    description!: string

    @IsString()
    @MinLength(50)
    @MaxLength(2000)
    instruction!: string
}

export interface IQuiz extends Document {
    title: string,
    description: string,
    instruction: string,
    createdAt: Date,
    updatedAt: Date
}

const quizSchema = new Schema<IQuiz>({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 1000
    },
    instruction: {
        type: String,
        required: true,
        minLength: 50,
        maxLength: 2000
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export const QuizModel = model<IQuiz>('Quiz', quizSchema);