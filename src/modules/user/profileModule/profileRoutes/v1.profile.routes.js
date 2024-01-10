import { Router } from 'express';
import ProfileController from '../profile.controller.js';

const profileRouter_v1 = Router();

// <domain>/api/v1/users
profileRouter_v1.get('/whoami', ProfileController.whoami);
profileRouter_v1.get('/findOne', ProfileController.findOneUser);

export default profileRouter_v1;
