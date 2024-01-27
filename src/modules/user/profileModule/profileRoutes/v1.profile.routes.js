import { Router } from 'express';
import authorizationGuard from '../../authModule/guards/authorization.guard.js';
import profileController from '../profile.controller.js';
import { Roles } from '../../model/user.model.js';

const profileRouter_v1 = Router();

// <domain>/api/v1/users/profile
profileRouter_v1.get('/whoami', profileController.whoami);
profileRouter_v1.get('/findOne', authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN]), profileController.findOneUser);

export default profileRouter_v1;
