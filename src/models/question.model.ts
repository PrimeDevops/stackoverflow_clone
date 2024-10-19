import mongoose, { Document, Schema } from 'mongoose';

export interface QuestionDocument extends Document {
  title: string;
  body: string;
  author: mongoose.Types.ObjectId;
  answers: mongoose.Types.ObjectId[];
  upvotes: number;
  downvotes: number;
  voters: { userId: mongoose.Types.ObjectId, voteType: string }[];  // Keeps track of upvotes/downvotes by users
  createdAt: Date;
}

const questionSchema = new Schema<QuestionDocument>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Referencing the User model
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      voteType: { type: String, enum: ['upvote', 'downvote'] }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model<QuestionDocument>('Question', questionSchema);
export default Question

/* import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  body: string;
  author: mongoose.Types.ObjectId;
  answers: mongoose.Types.ObjectId[];
  votes: number;
}

const QuestionSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  votes: { type: Number, default: 0 },
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
 */