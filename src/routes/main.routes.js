import { Router } from 'express';
import userRouter from '../modules/user/user.routes.js';

const mainRouter = Router();

mainRouter.use('/users', userRouter);

export default mainRouter;
