import schedule from 'node-schedule';
import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });
// import { Request, Response } from 'express';
import {updateTodoItemsAsCompleted} from '../services/cron.service';


export const startScheduledTasks = (): void => {
    // schedule.scheduleJob('* * * * * *', () => {
    //     console.info(`This task runs every second.`); // 36 21 * * *  

    // });

    //schedule runs every night at 12am.  
    schedule.scheduleJob('0 0 * * *', async () => {
        await updateTodoItemsAsCompleted();
    });
    
};

