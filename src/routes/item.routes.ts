import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { todoValidator } from '../validators/item.validator';
import {generateTodo,getItems,getItem,deleteItem,updateItem} from '../controllers/item.controller';

const router = express.Router();
router.use(auth); 

router.get('/lists',getItems);
router.post('/store', todoValidator, validateRequest, generateTodo);
router.get('/:id', getItem);
router.put('/:id', todoValidator, validateRequest, updateItem);
router.delete('/:id', deleteItem);

export default router; 