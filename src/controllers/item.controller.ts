import { Request, Response } from 'express';
import Item from '../models/item.model';
import moment from 'moment';

export const getItems = async (req: Request, res: Response) => {
  try {
    const todos = await Item.aggregate([
      { $match: { user: req.user._id } },
      {
        $project: {
          _id: 1,
          title: 1, 
          description: 1,
          completed: 1,
          dueDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dueDate",
              timezone: "UTC"
            }
          }
        }
      },
      { $sort: { dueDate: 1 } }
    ])
    
    res.json(todos);
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error: 'Error fetching todo-items' });
  }
};

// For Now allowing Old dates while create but we can validate and stop the old date todos creation
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


export const getItem = async (req: Request, res: Response) => {
  try {
    const todo = await Item.findOne({ _id: req.params.id, user: req.user._id });


    if (!todo) {
       res.status(404).json({ error: 'Item not found' });
       return;
    }

    const formattedTodo = {
      ...todo.toObject(),
      dueDate: moment(todo.dueDate).format('MMMM DD, YYYY'),
    };

    res.status(200).json(formattedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching todo' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const todo = await Item.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Todo Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting todo item.' });
  }
}; 

export const updateItem = async (req: Request, res: Response) => {
  try {
    if (req.body.dueDate) {
      const dueDate = new Date(req.body.dueDate);
      if (dueDate < new Date()) {
        res.status(400).json({ error: 'Due date cannot be in the past' });
        return;
      }
    }

    const todo = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) {
       res.status(404).json({ error: 'Todo item not found' });
       return;
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Error updating todo item' });
  }
};
