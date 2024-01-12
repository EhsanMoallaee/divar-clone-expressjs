import { Router } from 'express';
import imageController from '../image.controller.js';
import MediaStoragePathCheck from '../../../../middlewares/mediaPathCheck.middleware.js';

const imageRouter_v1 = Router();

// <domain>/api/v1/media/image
imageRouter_v1.get('/', imageController.fetchAll);
imageRouter_v1.post('/upload-image', [MediaStoragePathCheck('image')], imageController.uploadImage);

export default imageRouter_v1;
