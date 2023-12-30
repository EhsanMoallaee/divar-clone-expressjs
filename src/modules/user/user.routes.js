import { Router } from 'express';
import authRouter from './auth/authRoutes/auth.routes.js';
import profileRouter from './profile/profileRoutes/profile.routes.js';

const userRouter = Router();

userRouter.use('/auth', authRouter);
userRouter.use('/profile', profileRouter);

export default userRouter;
