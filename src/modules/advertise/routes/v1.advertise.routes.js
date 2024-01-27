import { Router } from 'express';
import authenticationGuard from '../../user/authModule/guards/authentication.guard.js';
import authorizationGuard from '../../user/authModule/guards/authorization.guard.js';
import parameterRouter_v1 from '../parameterModule/parameterRoutes/v1.parameter.routes.js';
import postRouter_v1 from '../postModule/postRoutes/v1.post.routes.js';
import { Roles } from '../../user/model/user.model.js';

const advertiseRouter_v1 = Router();

advertiseRouter_v1.use(
	'/parameter',
	[authenticationGuard, authorizationGuard([Roles.SUPERADMIN, Roles.ADMIN])],
	parameterRouter_v1
); // <domain>/api/v1/advertise/parameter
advertiseRouter_v1.use('/post', postRouter_v1); // <domain>/api/v1/advertise/post

export default advertiseRouter_v1;
