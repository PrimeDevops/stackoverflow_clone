import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  message: string;
}

const NotificationSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export default Notification;
