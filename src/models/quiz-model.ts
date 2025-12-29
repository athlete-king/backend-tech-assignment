import { Schema, model, Document } from "mongoose";

interface IQuiz extends Document {
    title: string,
    description: string,
    instruction: string,
    createAt: Date,
    updateAt: Date
}

const quizSchema = new Schema<IQuiz>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instruction: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const QuizModel = model<IQuiz>('Quiz', quizSchema);

export { QuizModel };