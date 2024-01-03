import { Router } from 'express';
import authController from '../../auth.controller.js';

const authRouter_v1 = Router();

authRouter_v1.post('/registerationRequest', authController.registerationRequest); // <domain>/api/users/auth/v1/register

export default authRouter_v1;
