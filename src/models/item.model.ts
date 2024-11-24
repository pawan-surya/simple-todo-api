import mongoose, { Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  dueDate: Date;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
}

// This is the todoItems Schema
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,versionKey: false
});

export default mongoose.model<IItem>('TodoItem', itemSchema); 