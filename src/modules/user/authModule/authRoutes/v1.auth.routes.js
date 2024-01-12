import { Router } from 'express';
import authController from '../auth.controller.js';
import authenticationGuard from '../../../../guards/authentication.guard.js';

const authRouter_v1 = Router();

// <domain>/api/v1/users/auth
authRouter_v1.post('/registeration-request', authController.registerationRequest);
authRouter_v1.post('/register', authController.register);
authRouter_v1.post('/login-request', authController.loginRequest);
authRouter_v1.post('/login', authController.login);
authRouter_v1.get('/logout', authenticationGuard, authController.logout);

export default authRouter_v1;
