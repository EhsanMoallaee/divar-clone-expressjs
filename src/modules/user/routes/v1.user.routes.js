import { Router } from 'express';
import authRouter_v1 from '../authModule/authRoutes/v1.auth.routes.js';
import profileRouter_v1 from '../profileModule/profileRoutes/v1.profile.routes.js';
import authenticationGuard from '../../../guards/authentication.guard.js';

const userRouter_v1 = Router();

userRouter_v1.use('/auth', authRouter_v1); // <domain>/api/v1/users/auth
userRouter_v1.use('/profile', authenticationGuard, profileRouter_v1); // <domain>/api/v1/users/profile

export default userRouter_v1;
