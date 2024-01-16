import { Router } from 'express';
import parameterRouter_v1 from '../parameterModule/parameterRoutes/v1.parameter.routes.js';
import postRouter_v1 from '../postModule/postRoutes/v1.post.routes.js';

const advertiseRouter_v1 = Router();

advertiseRouter_v1.use('/parameter', parameterRouter_v1); // <domain>/api/v1/advertise/parameter
advertiseRouter_v1.use('/post', postRouter_v1); // <domain>/api/v1/advertise/post

export default advertiseRouter_v1;
