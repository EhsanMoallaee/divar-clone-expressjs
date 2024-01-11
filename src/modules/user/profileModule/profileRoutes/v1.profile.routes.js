import { Router } from 'express';
import authorizationGuard from '../../../../guards/authorization.guard.js';
import ProfileController from '../profile.controller.js';
import { Roles } from '../../model/user.model.js';

const profileRouter_v1 = Router();

// <domain>/api/v1/users
profileRouter_v1.get('/whoami', ProfileController.whoami);
profileRouter_v1.get('/findOne', authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN]), ProfileController.findOneUser);

export default profileRouter_v1;
