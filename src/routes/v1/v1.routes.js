import { Router } from 'express';

import advertiseRouter_v1 from '../../modules/advertise/routes/v1.advertise.routes.js';
import categoryRouter_v1 from '../../modules/category/routes/v1.category.routes.js';
import mediaRouter_v1 from '../../modules/media/routes/v1.media.routes.js';
import userRouter_v1 from '../../modules/user/routes/v1.user.routes.js';

const v1_Router = Router();

v1_Router.use('/advertise', advertiseRouter_v1); // <domain>/api/v1/advertise
v1_Router.use('/category', categoryRouter_v1); // <domain>/api/v1/category
v1_Router.use('/media', mediaRouter_v1); // <domain>/api/v1/media
v1_Router.use('/users', userRouter_v1); // <domain>/api/v1/users

export default v1_Router;
