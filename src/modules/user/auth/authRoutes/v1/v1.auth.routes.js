import { Router } from 'express';
import authController from '../../auth.controller.js';
import authorizationGuard from '../../../../../guards/authorization.guard.js';

const authRouter_v1 = Router();

authRouter_v1.post('/registerationRequest', authController.registerationRequest); // <domain>/api/users/auth/v1/registerationRequest
authRouter_v1.post('/register', authController.register); // <domain>/api/users/auth/v1/register
authRouter_v1.post('/loginRequest', authController.loginRequest); // <domain>/api/users/auth/v1/loginRequest
authRouter_v1.post('/login', authController.login); // <domain>/api/users/auth/v1/login
authRouter_v1.get('/logout', authorizationGuard, authController.logout); // <domain>/api/users/auth/v1/logout

export default authRouter_v1;
