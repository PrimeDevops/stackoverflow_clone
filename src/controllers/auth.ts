import express from "express"
import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({where : { username}})
    if (!username || !email || !password ) {
      res.status(400).json({ message: 'Incomplete credentials' });
      return
    }
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return
    }
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error, 'error')
    //res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginUser = async (req: express.Request, res: express.Response):Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return  
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { 
      res.status(400).json({ message: 'Invalid password' });
      return
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '3d' });
    res.status(200).json({ 
      message: "Logged in successfully",
      data: {
        token, 
        username: user.username,
        email: user.email,
        id: user._id
      }  
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user' });
  }
};
