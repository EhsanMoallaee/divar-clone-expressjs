import { Router } from 'express';
import authController from '../auth.controller.js';
import authorizationGuard from '../../../../guards/authorization.guard.js';

const authRouter_v1 = Router();

authRouter_v1.post('/registerationRequest', authController.registerationRequest); // <domain>/api/v1/users/auth/registerationRequest
authRouter_v1.post('/register', authController.register); // <domain>/api/v1/users/auth/register
authRouter_v1.post('/loginRequest', authController.loginRequest); // <domain>/api/v1/users/auth/loginRequest
authRouter_v1.post('/login', authController.login); // <domain>/api/v1/users/auth/login
authRouter_v1.get('/logout', authorizationGuard, authController.logout); // <domain>/api/v1/users/auth/logout

export default authRouter_v1;
