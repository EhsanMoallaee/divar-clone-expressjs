import { Router } from 'express';
import categoryRouter_v1 from './v1/v1.category.routes.js';
const categoryRouter = Router();

categoryRouter.use('/v1', categoryRouter_v1);

export default categoryRouter;
