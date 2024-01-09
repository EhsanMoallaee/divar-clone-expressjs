import { Router } from 'express';
import userRouter from '../modules/user/routes/user.routes.js';
import categoryRouter from '../modules/category/routes/category.routes.js';

const mainRouter = Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/category', categoryRouter);

export default mainRouter;
