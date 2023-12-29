import { Router } from 'express';
import v1_authRouter from './v1/v1.auth.routes.js';

const authRouter = Router();

authRouter.use('/v1', v1_authRouter);

export default authRouter;
