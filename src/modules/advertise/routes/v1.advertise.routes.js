import { Router } from 'express';
import parameterRouter_v1 from '../parameterModule/parameterRoutes/v1.parameter.routes.js';

const advertiseRouter_v1 = Router();

advertiseRouter_v1.use('/parameter', parameterRouter_v1); // <domain>/api/v1/advertise/parameter

export default advertiseRouter_v1;
