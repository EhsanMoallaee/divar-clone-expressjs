import { Router } from 'express';
import authRouter from '../authModule/authRoutes/auth.routes.js';
import profileRouter from '../profileModule/profileRoutes/profile.routes.js';
import authorizationGuard from '../../../guards/authorization.guard.js';

const userRouter = Router();

userRouter.use('/auth', authRouter);
userRouter.use('/profile', authorizationGuard, profileRouter);

export default userRouter;
