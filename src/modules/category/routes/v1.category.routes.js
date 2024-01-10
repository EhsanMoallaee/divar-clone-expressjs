import { Router } from 'express';
import authenticationGuard from '../../../guards/authentication.guard.js';
import authorizationGuard from '../../../guards/authorization.guard.js';
import categoryController from '../category.controller.js';
import { Roles } from '../../user/model/user.model.js';

const categoryRouter_v1 = Router();

// <domain>/api/v1/category
categoryRouter_v1.post(
	'/',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	categoryController.create
);
categoryRouter_v1.delete(
	'/:catId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	categoryController.deleteById
);
categoryRouter_v1.get('/:catId', categoryController.findById);
categoryRouter_v1.get('/', categoryController.fetchAll);

export default categoryRouter_v1;
