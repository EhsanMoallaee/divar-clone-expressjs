import { Router } from 'express';
import v1_Router from './v1/v1.routes.js';

const mainRouter = Router();

mainRouter.use('/v1', v1_Router); // <domain>/api/v1

export default mainRouter;
