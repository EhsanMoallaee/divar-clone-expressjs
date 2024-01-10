import { Router } from 'express';
import authenticationGuard from '../../../guards/authentication.guard.js';
import authorizationGuard from '../../../guards/authorization.guard.js';
import categoryController from '../category.controller.js';
import { Roles } from '../../user/model/user.model.js';

const categoryRouter_v1 = Router();

categoryRouter_v1.post(
	'/',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	categoryController.create
); // <domain>/api/v1/category
categoryRouter_v1.get('/:catId', categoryController.findById); // <domain>/api/v1/category/catId
categoryRouter_v1.get('/', categoryController.fetchAll); // <domain>/api/v1/category
categoryRouter_v1.delete('/:catId', categoryController.deleteById); // <domain>/api/v1/category/catId

export default categoryRouter_v1;
