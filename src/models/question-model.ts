import { Types, Schema, model, Document } from "mongoose";
import { IsArray, IsEnum, IsString, IsOptional, MaxLength, MinLength, IsNumber, Max, Min } from "class-validator";

export type QuestionType = 'free-text' | 'multiple-choice';

export class QuestionValidator {
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    text!: string

    @IsEnum(["free-text", "multiple-choice"])
    type!: string

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    choices?: string[]

    @IsString()
    @IsArray()
    @IsString({ each: true })
    correctAnswer!: string | string[]

    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    explanation!: string

    @IsNumber()
    @Min(10)
    @Max(600)
    timeLimit!: number
}

export interface IQuestion extends Document {
    text: string,
    type: QuestionType,
    choices?: string[],
    correctAnswer: string | string[],
    explanation: string,
    timeLimit: number,
    quizId: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const questionSchema = new Schema<IQuestion>({
    text: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 200
    },
    type: {
        type: String,
        enum: ["free-text", "multiple-choice"],
        required: true,
    },
    choices: {
        type: [String],
        required: function (this: IQuestion) {
            return this.type == 'multiple-choice';
        }
    },
    correctAnswer: {
        type: Schema.Types.Mixed,
        trim: true,
        required: true
    },
    explanation: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 1000
    },
    timeLimit: {
        type: Number,
        min: 10,
        max: 60
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
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

export const QuestionModel = model<IQuestion>('Question', questionSchema);