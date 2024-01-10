import { Router } from 'express';
import userRouter from '../modules/user/routes/user.routes.js';
import categoryRouter from '../modules/category/routes/category.routes.js';

const mainRouter = Router();

mainRouter.use('/users', userRouter); // <domain>/api/users
mainRouter.use('/category', categoryRouter); // <domain>/api/category

export default mainRouter;
