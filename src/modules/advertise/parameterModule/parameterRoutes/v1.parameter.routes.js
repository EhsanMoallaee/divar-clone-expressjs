import { Router } from 'express';
import parameterController from '../parameter.controller.js';

const parameterRouter_v1 = Router();

// <domain>/api/v1/advertise/parameter
parameterRouter_v1.post('/', parameterController.create);
parameterRouter_v1.get('/by-id/:parameterId', parameterController.findById);
parameterRouter_v1.get('/by-category-id/:categoryId', parameterController.findByCategoryId);
parameterRouter_v1.get('/by-category-slug/:categorySlug', parameterController.findByCategorySlug);
parameterRouter_v1.get('/', parameterController.fetchAll);
parameterRouter_v1.patch('/:parameterId', parameterController.update);
parameterRouter_v1.delete('/:parameterId', parameterController.delete);

export default parameterRouter_v1;
