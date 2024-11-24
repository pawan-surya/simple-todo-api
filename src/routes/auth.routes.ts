import express from 'express';
import { signup, login } from '../controllers/auth.controller';
import { signupValidator, loginValidator } from '../validators/auth.validator';
import { validateRequest } from '../middleware/validate.middleware';

const router = express.Router();

router.post('/signup', signupValidator, validateRequest, signup);
router.post('/login', loginValidator, validateRequest, login);

export default router; 