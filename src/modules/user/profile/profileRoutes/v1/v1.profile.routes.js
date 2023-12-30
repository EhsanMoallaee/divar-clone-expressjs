import { Router } from 'express';
import ProfileController from '../../profile.controller.js';

const profileRouter_v1 = Router();

profileRouter_v1.post('/findOne', ProfileController.findOneUser); // <domain>/api/users/profile/v1/findOne

export default profileRouter_v1;
