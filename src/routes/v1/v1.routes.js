import { Router } from 'express';
import userRouter_v1 from '../../modules/user/routes/v1.user.routes.js';
import categoryRouter_v1 from '../../modules/category/routes/v1.category.routes.js';

const v1_Router = Router();

v1_Router.use('/users', userRouter_v1); // <domain>/api/v1/users
v1_Router.use('/category', categoryRouter_v1); // <domain>/api/v1/category

export default v1_Router;
