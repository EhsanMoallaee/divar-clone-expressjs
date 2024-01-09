import { Router } from 'express';
import categoryController from '../../category.controller.js';

const categoryRouter_v1 = Router();

categoryRouter_v1.post('/create', categoryController.create); // <domain>/api/category/v1/create
categoryRouter_v1.get('/fetchAll', categoryController.fetchAll); // <domain>/api/category/v1/fetchAll

export default categoryRouter_v1;
