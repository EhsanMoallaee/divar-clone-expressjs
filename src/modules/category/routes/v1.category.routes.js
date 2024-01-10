import { Router } from 'express';
import categoryController from '../category.controller.js';

const categoryRouter_v1 = Router();

categoryRouter_v1.post('/', categoryController.create); // <domain>/api/v1/category
categoryRouter_v1.get('/', categoryController.fetchAll); // <domain>/api/v1/category

export default categoryRouter_v1;
