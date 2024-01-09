import AbstractRepository from '../../../dataAccessLayer/abstract.repository.js';
import CategoryModel from './category.model.js';

class CategoryRepository extends AbstractRepository {
	constructor() {
		super(CategoryModel);
	}
}

export default new CategoryRepository();
