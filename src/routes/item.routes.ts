import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { todoValidator } from '../validators/item.validator';
import {generateTodo,getItems} from '../controllers/item.controller';

const router = express.Router();
router.use(auth); 

router.get('/lists',getItems);
router.post('/store', todoValidator, validateRequest, generateTodo);


export default router; 