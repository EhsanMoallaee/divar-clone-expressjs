import { Router } from 'express';
import ProfileController from '../../profile.controller.js';

const profileRouter_v1 = Router();

profileRouter_v1.get('/whoami', ProfileController.whoami); // <domain>/api/users/profile/v1/whoami
profileRouter_v1.get('/findOne', ProfileController.findOneUser); // <domain>/api/users/profile/v1/findOne

export default profileRouter_v1;
