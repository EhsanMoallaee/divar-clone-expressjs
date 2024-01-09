import CategoryRepository from './model/category.repository.js';

class CategoryService {
	#CategoryRepository;
	constructor() {
		this.#CategoryRepository = CategoryRepository;
	}

	create = async (data) => {
		const category = await this.#CategoryRepository.create(data);
		return category;
	};

	fetchAll = async () => {
		const categoryies = await this.#CategoryRepository.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
		return categoryies;
	};
}

export default new CategoryService();
