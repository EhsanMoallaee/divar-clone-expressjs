import { isValidObjectId } from 'mongoose';
import slugify from 'slugify';

import AppError from '../errorHandling/app.error.js';
import categoryErrorMessages from './messages/category.errorMessages.js';
import CategoryRepository from './model/category.repository.js';
import CategoryValidator from './validators/category.validator.js';

class CategoryService {
	#CategoryRepository;
	constructor() {
		this.#CategoryRepository = CategoryRepository;
	}

	create = async (categoryDTO) => {
		const { error } = CategoryValidator.addCategoryValidator(categoryDTO);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					categoryErrorMessages.FieldIsNotAllowed.message,
					categoryErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else {
				throw new AppError(
					categoryErrorMessages.ExceptionError.message,
					categoryErrorMessages.ExceptionError.statusCode
				);
			}
		}
		if (categoryDTO.parentId && isValidObjectId(categoryDTO.parentId)) {
			const foundCategory = await this.checkExistCategory(categoryDTO?.parentId);
			if (!foundCategory)
				throw new AppError(
					categoryErrorMessages.ParentCategoryDidntFound.message,
					categoryErrorMessages.ParentCategoryDidntFound.statusCode
				);
			categoryDTO.parentsIdArray = [...foundCategory.parentsIdArray, categoryDTO.parentId];
		}
		if (categoryDTO.parentId == '') delete categoryDTO.parentId;
		categoryDTO.slug = slugify(categoryDTO.slug, { remove: /[*+~.()'"!?_^#&:@]/g });
		const category = await this.#CategoryRepository.create(categoryDTO);
		return category;
	};

	findById = async (categoryId) => {
		const category = await this.checkExistCategory(categoryId);
		if (!category)
			throw new AppError(
				categoryErrorMessages.CategoryDidntFound.message,
				categoryErrorMessages.CategoryDidntFound.statusCode
			);
		return category;
	};

	fetchAll = async () => {
		const categoryies = await this.#CategoryRepository.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
		if (!categoryies || categoryies.length == 0) {
			throw new AppError(
				categoryErrorMessages.CategoriesDidntFound.message,
				categoryErrorMessages.CategoriesDidntFound.statusCode
			);
		}
		return categoryies;
	};

	checkExistCategory = async (categoryId) => {
		const category = await this.#CategoryRepository.findOneById(categoryId);
		return category;
	};
}

export default new CategoryService();
