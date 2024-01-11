import { Router } from 'express';
import imageController from '../image.controller.js';

const imageRouter_v1 = Router();

// <domain>/api/v1/users/auth
imageRouter_v1.get('/', imageController.fetchAll);

export default imageRouter_v1;
