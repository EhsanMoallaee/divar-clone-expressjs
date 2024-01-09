import AppError from '../errorHandling/app.error.js';
import categoryErrorMessages from './messages/category.errorMessages.js';
import CategoryRepository from './model/category.repository.js';
import CategoryValidator from './validators/category.validator.js';

class CategoryService {
	#CategoryRepository;
	constructor() {
		this.#CategoryRepository = CategoryRepository;
	}

	create = async (data) => {
		const { error } = CategoryValidator.addCategoryValidator(data);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					categoryErrorMessages['FieldIsNotAllowed'].message,
					categoryErrorMessages['FieldIsNotAllowed'].statusCode
				);
			} else {
				throw new AppError(
					categoryErrorMessages[errorMessage].message,
					categoryErrorMessages[errorMessage].statusCode
				);
			}
		}
		const category = await this.#CategoryRepository.create(data);
		return category;
	};

	fetchAll = async () => {
		const categoryies = await this.#CategoryRepository.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
		return categoryies;
	};
}

export default new CategoryService();
