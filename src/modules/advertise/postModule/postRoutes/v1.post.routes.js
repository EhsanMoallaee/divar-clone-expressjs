import { Router } from 'express';
import postController from '../post.controller.js';
import uploadMiddleware from '../../../../middlewares/uploadImage.middleware.js';
import mediaStoragePathCheck from '../../../../middlewares/mediaPathCheck.middleware.js';
import UploadFieldNames from '../../../../common/constants/uploadFile.enum.js';

const postRouter_v1 = Router();

// <domain>/api/v1/advertise/post
postRouter_v1.post('/', [mediaStoragePathCheck(UploadFieldNames.FIELD_NAME), uploadMiddleware], postController.create);

export default postRouter_v1;
