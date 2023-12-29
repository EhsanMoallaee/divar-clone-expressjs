import { Router } from 'express';
import authRouter from './auth/authRoutes/auth.routes.js';

const userRouter = Router();

userRouter.use('/auth', authRouter);

export default userRouter;
