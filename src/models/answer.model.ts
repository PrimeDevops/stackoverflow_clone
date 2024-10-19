import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  body: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  votes: number;
  voters: { userId: mongoose.Types.ObjectId, voteType: 'upvote' | 'downvote' }[];
}

const AnswerSchema: Schema = new Schema({
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  votes: { type: Number, default: 0 },
  voters: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    voteType: { type: String, enum: ['upvote', 'downvote'], required: true }
  }]
});

export default mongoose.model<IAnswer>('Answer', AnswerSchema);
