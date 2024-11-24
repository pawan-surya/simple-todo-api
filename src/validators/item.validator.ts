import { body } from 'express-validator';
import moment from 'moment';

// Validation on Todo Items
export const todoValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .custom((value) => {
      // Check if the date is in YYYY-MM-DD format
      if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('Invalid date format. Please follow only YYYY-MM-DD');
      }
      return true;
    }),
  
  body('description')
    .notEmpty()
    .withMessage('Description cannot be empty')
    .trim()
];
