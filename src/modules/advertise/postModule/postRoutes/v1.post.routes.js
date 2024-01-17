import { Router } from 'express';
import postController from '../post.controller.js';
import uploadMiddleware from '../../../../middlewares/uploadImage.middleware.js';
import mediaStoragePathCheck from '../../../../middlewares/mediaPathCheck.middleware.js';
import UploadFieldNames from '../../../../common/constants/uploadFile.enum.js';

const postRouter_v1 = Router();

// <domain>/api/v1/advertise/post
postRouter_v1.post('/', [mediaStoragePathCheck(UploadFieldNames.FIELD_NAME), uploadMiddleware], postController.create);
postRouter_v1.get('/by-id/:postId', postController.findByPostId);
postRouter_v1.get('/by-category-slug/:categorySlug', postController.findByCategorySlug);
postRouter_v1.get('/by-address', postController.findByAddress);
postRouter_v1.get('/by-categorySlug-address', postController.findByCategorySlugAndAddress);
postRouter_v1.delete('/:postId', postController.delete);

export default postRouter_v1;
