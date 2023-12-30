import { Router } from 'express';
import v1_profileRouter from './v1/v1.profile.routes.js';

const profileRouter = Router();

profileRouter.use('/v1', v1_profileRouter);

export default profileRouter;
