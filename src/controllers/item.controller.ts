import { Request, Response } from 'express';
import Item from '../models/item.model';
import moment from 'moment';

export const getItems = async (req: Request, res: Response) => {
  try {
    const todos = await Item.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching todo-items' });
  }
};


export const generateTodo = async (req: Request, res: Response) => {
  try {
    const todo = new Item({...req.body,user: req.user._id});
    // let { title, dueDate } = req.body;
    const existingTodo = await Item.findOne({user: req.user._id,title: { $regex: new RegExp(`^${req.body.title}$`, 'i') }, dueDate: req.body.dueDate});

    if (existingTodo) {
       res.status(400).json({error: 'A todo with the same title and due date already exists'});
       return;
    }

    await todo.save();
    req.body.dueDate = moment(req.body.dueDate).format('MMMM DD, YYYY');
    res.status(201).json(req.body);
  } catch (error) {
    res.status(400).json({ error: 'Error creating todo-item' });
  }
};
