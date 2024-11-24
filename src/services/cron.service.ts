import cron from 'node-cron';
import Item from '../models/item.model';


export const updateTodoItemsAsCompleted = (): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const currentDate = new Date();
      
      // Find and update expired todos
      await Item.updateMany(
        {
          dueDate: { $lt: currentDate },
          completed: false
        },
        {
          completed: true
        }
      );
      
      console.log('Updated expired todos items');
      return resolve();
    } catch (error) {
      console.error('Error updating todos:', error);
      return reject(error);
    }
  });
}; 