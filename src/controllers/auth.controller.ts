import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';


export const signup = async (req: any, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({success: true,message: "User Signup Successfully."});
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error creating user' });
  }
};

export const login = async (req: any, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
       res.status(401).json({ error: 'Invalid Email' });
       return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       res.status(401).json({ error: 'Invalid Password' });
       return;
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

    res.json({ email: user.email,_id: user._id,token:  token });
  } catch (error: any) {
    console.log("error", error)
    res.status(400).json({ error: 'Error logging in' });
  }
}; 