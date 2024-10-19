// src/models/subscription.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
}

const SubscriptionSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
});

const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
export default Subscription;
