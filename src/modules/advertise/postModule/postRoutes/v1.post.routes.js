import { Router } from 'express';

import authenticationGuard from '../../../../guards/authentication.guard.js';
import authorizationGuard from '../../../../guards/authorization.guard.js';
import mediaStoragePathCheck from '../../../../middlewares/mediaPathCheck.middleware.js';
import postController from '../post.controller.js';
import { Roles } from '../../../user/model/user.model.js';
import uploadMiddleware from '../../../../middlewares/uploadImage.middleware.js';
import UploadFieldNames from '../../../../common/constants/uploadFile.enum.js';

const postRouter_v1 = Router();

// <domain>/api/v1/advertise/post
postRouter_v1.post(
	'/',
	[authenticationGuard, mediaStoragePathCheck(UploadFieldNames.FIELD_NAME), uploadMiddleware],
	postController.create
);
postRouter_v1.delete(
	'/:postId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	postController.delete
);
postRouter_v1.patch(
	'/confirm-post/:postId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	postController.confirmPost
);
postRouter_v1.get('/my-posts', authenticationGuard, postController.myPosts);
postRouter_v1.get('/by-id/:postId', postController.findByPostId);
postRouter_v1.get('/by-category-slug/:categorySlug', postController.findByCategorySlug);
postRouter_v1.get('/by-address', postController.findByAddress);
postRouter_v1.get('/by-categorySlug-address', postController.findByCategorySlugAndAddress);

export default postRouter_v1;
