import { Request, Response } from "express";
import Question from "../models/question.model";
import User, { IUser } from "../models/user.model";
import Subscription from "../models/subscription.model";

// Subscribe a user to a question
export const subscribeToQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, questionId } = req.body;

  try {
    const user = await User.findById(userId);
    const question = await Question.findById(questionId);

    if (!user || !question) {
      res.status(404).json({ message: "User or Question not found" });
      return;
    }

    const subscription = new Subscription({
      user: userId,
      question: questionId,
    });
    await subscription.save();

    res.status(201).json({ message: "Subscribed to question successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to subscribe", error });
    return;
  }
};

// Unsubscribe a user from a question
export const unsubscribeFromQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, questionId } = req.body;

  try {
    const subscription = await Subscription.findOne({
      user: userId,
      question: questionId,
    });
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    console.log("subscription");

    await subscription.deleteOne();
    res
      .status(200)
      .json({ message: "Unsubscribed from question successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unsubscribe", error });
    return;
  }
};

// Get all subscriptions for a user
export const getUserSubscriptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const subscriptions = await Subscription.find({ user: userId }).populate(
      "question"
    );

    if (!subscriptions.length) {
      res.status(404).json({ message: "No subscriptions found" });
      return;
    }

    res.status(200).json(subscriptions);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve subscriptions", error });
    return;
  }
};

// Notify users when a question they subscribed to has a new answer
export const notifySubscribers = async (
  questionId: string,
  answerId: string
) => {
  try {
    const subscriptions = await Subscription.find({
      question: questionId,
    }).populate("user");

    subscriptions.forEach((subscription) => {
      const user = subscription.user;
      // @ts-ignore
      console.log(`Notifying user ${user.email} about new answer: ${answerId}`);
      // Implement email or in-app notification logic here
    });
  } catch (error) {
    console.error("Failed to notify subscribers", error);
  }
};
