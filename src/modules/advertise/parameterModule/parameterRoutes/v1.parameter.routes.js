import { Router } from 'express';
import parameterController from '../parameter.controller.js';

const parameterRouter_v1 = Router();

// <domain>/api/v1/advertise/parameter
parameterRouter_v1.post('/', parameterController.create);
parameterRouter_v1.get('/', parameterController.fetchAll);

export default parameterRouter_v1;
