import { Request, Response } from "express";
import Question from "../models/question.model";
import mongoose from "mongoose";

export const createQuestion = async (req: Request, res: Response) => {
  const { title, body, author } = req.body;
  try {
    const newQuestion = new Question({ title, body, author });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating question" });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find().populate("author");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};
