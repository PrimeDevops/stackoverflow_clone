import { Request, Response } from "express";
import Answer, { IAnswer } from "../models/answer.model";
import Question from "../models/question.model";
import mongoose from "mongoose";
import Subscription from "../models/subscription.model";
import Notification from "../models/notification.model";
//import notifier from "node-notifier";

const notifier = require("node-notifier");
const path = require("path");

// Create an answer for a specific question
export const createAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { questionId } = req.params;
  const { body, author } = req.body; // Assuming author is passed as part of the request body

  try {
    // Check if the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    // Create the answer
    const newAnswer = new Answer({
      body,
      author: new mongoose.Types.ObjectId(author), // Convert author to ObjectId
      question: new mongoose.Types.ObjectId(questionId), // Convert questionId to ObjectId
    });

    await newAnswer.save();

    // Add the answer reference to the question
    question.answers.push(newAnswer?.id); // Ensure the question schema has an 'answers' field
    await question.save();

    const subscriptions = await Subscription.find({ question: questionId });
    // Send notifications to all subscribed users

    if (subscriptions.length > 0) {
      for (const subscription of subscriptions) {
        const notification = new Notification({
          user: subscription.user,
          question: questionId,
          message: `A new answer has been posted to the question you're subscribed to: ${question.title}`,
        });

        await notification.save();
        // Send notification (optional)
        notifier.notify({
          title: question?.title,
          message: body,
          sound: true,
          icon: path.join(__dirname, "kora.jpg"),
        });
      }
    }

    res.status(201).json({
      message: "Answer created successfully and notifications sent",
      newAnswer,
    });

    return;
  } catch (error) {
    res.status(500).json({ message: "Error creating answer", error });
  }
};

// Get answers for a specific question
export const getAnswersForQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { questionId } = req.params;

  try {
    // Check if the question exists and populate its answers with author details
    const question = await Question.findById(questionId).populate({
      path: "answers",
      populate: { path: "author", select: "username" }, // Assuming 'User' has a 'username' field
    });

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.status(200).json({ answers: question.answers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching answers", error });
  }
};

// Delete an answer
export const deleteAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { answerId } = req.params;
  const userId = req.body.user.id; // Assuming user is authenticated and req.user contains the user ID

  try {
    const answer = await Answer.findById(answerId);

    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    // Check if the user is the author of the answer
    if (answer.author.toString() !== userId.toString()) {
      res.status(403).json({ message: "Unauthorized to delete this answer" });
      return;
    }

    await answer.deleteOne(); // Use deleteOne instead of remove (deprecation warning)

    res.status(200).json({ message: "Answer deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error deleting answer", error });
  }
};

export const upvoteAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { answerId } = req.params;
  const userId = req.body.user.id; // Assuming the user is authenticated and available in req.user

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }
    const hasUpvote = (answer: IAnswer): boolean => {
      for (let i = 0; i < answer.voters.length; i++) {
        if (answer.voters[i].voteType === "upvote") {
          return true; // Found a upvote
        }
      }
      return false; // No upvote found
    };
    // Check if user has already upvoted
    if (hasUpvote(answer)) {
      res.status(400).json({ message: "You have already upvoted this answer" });
      return;
    }

    // If the user previously downvoted, remove that downvote
    const existingVote = answer.voters.find(
      (voter) => voter.userId.toString() === userId.toString()
    );
    if (existingVote && existingVote.voteType === "downvote") {
      answer.votes += 1;
      answer.voters = answer.voters.filter(
        (voter) => voter.userId.toString() !== userId.toString()
      );
      return;
    }

    // Add new upvote
    answer.votes += 1;
    answer.voters.push({
      userId: new mongoose.Types.ObjectId(userId),
      voteType: "upvote",
    });

    await answer.save();
    res.status(200).json({ message: "Answer upvoted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Error upvoting answer", error });
  }
};

// Downvote an answer
export const downvoteAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { answerId } = req.params;
  const userId = req.body.user.id; // Assuming the user is authenticated and available in req.user

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }
    const hasDownvote = (answer: IAnswer): boolean => {
      for (let i = 0; i < answer.voters.length; i++) {
        if (answer.voters[i].voteType === "downvote") {
          return true; // Found a downvote
        }
      }
      return false; // No downvote found
    };
    if (hasDownvote(answer)) {
      res
        .status(400)
        .json({ message: "You have already downvoted this answer" });
      return;
    }

    // If the user previously upvoted, remove that upvote
    const existingVote = answer.voters.find(
      (voter) => voter.userId.toString() === userId.toString()
    );
    if (existingVote && existingVote.voteType === "upvote") {
      answer.votes -= 1;
      answer.voters = answer.voters.filter(
        (voter) => voter.userId.toString() !== userId.toString()
      );
      return;
    }

    // Add new downvote
    answer.votes -= 1;
    answer.voters.push({
      userId: new mongoose.Types.ObjectId(userId),
      voteType: "downvote",
    });

    await answer.save();
    res.status(200).json({ message: "Answer downvoted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Error downvoting answer", error });
  }
};
