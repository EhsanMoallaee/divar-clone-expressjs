import { Router } from 'express';
import parameterController from '../parameter.controller.js';
import authenticationGuard from '../../../../guards/authentication.guard.js';
import authorizationGuard from '../../../../guards/authorization.guard.js';
import { Roles } from '../../../user/model/user.model.js';

const parameterRouter_v1 = Router();

// <domain>/api/v1/advertise/parameter
parameterRouter_v1.post(
	'/',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterController.create
);
parameterRouter_v1.delete(
	'/:parameterId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterController.delete
);
parameterRouter_v1.get(
	'/by-id/:parameterId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterController.findById
);
parameterRouter_v1.get(
	'/by-category-id/:categoryId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterController.findByCategoryId
);
parameterRouter_v1.get(
	'/',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterController.fetchAll
);
parameterRouter_v1.patch(
	'/:parameterId',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterController.update
);
parameterRouter_v1.get('/by-category-slug/:categorySlug', parameterController.findByCategorySlug);

export default parameterRouter_v1;
