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
		const { error } = CategoryValidator.createCategoryValidator(categoryDTO);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					categoryErrorMessages.FieldIsNotAllowed.message,
					categoryErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (categoryErrorMessages[errorMessage]) {
				throw new AppError(
					categoryErrorMessages[errorMessage].message,
					categoryErrorMessages[errorMessage].statusCode
				);
			} else {
				throw new AppError(
					categoryErrorMessages.ExceptionError.message,
					categoryErrorMessages.ExceptionError.statusCode
				);
			}
		}
		let parentCategory;
		if (categoryDTO.parentId && isValidObjectId(categoryDTO.parentId)) {
			parentCategory = await this.checkExistCategory(categoryDTO?.parentId);
			if (!parentCategory)
				throw new AppError(
					categoryErrorMessages.ParentCategoryNotFound.message,
					categoryErrorMessages.ParentCategoryNotFound.statusCode
				);
			categoryDTO.parentsIdArray = [...parentCategory.parentsIdArray, categoryDTO.parentId];
		}
		if (categoryDTO.parentId == '') delete categoryDTO.parentId;
		categoryDTO.slug = slugify(categoryDTO.slug, { remove: /[*+~.()'"!?_^#&:@]/g, locale: 'fa' });
		const category = await this.#CategoryRepository.create(categoryDTO);
		if (parentCategory && !parentCategory.hasChild)
			await this.#CategoryRepository.update(parentCategory._id, { $set: { hasChild: true } });
		return category;
	};

	findById = async (categoryId) => {
		const category = await this.checkExistCategory(categoryId);
		if (!category)
			throw new AppError(
				categoryErrorMessages.CategoryNotFound.message,
				categoryErrorMessages.CategoryNotFound.statusCode
			);
		return category;
	};

	findBySlug = async (slug) => {
		const category = await this.#CategoryRepository.findOne({ slug }, { __v: 0, createdAt: 0, updatedAt: 0 });
		if (!category)
			throw new AppError(
				categoryErrorMessages.CategoryNotFound.message,
				categoryErrorMessages.CategoryNotFound.statusCode
			);
		return category;
	};

	fetchAllRootCategories = async () => {
		const categories = await this.#CategoryRepository.find(
			{ parentId: { $exists: false } },
			{ __v: 0, createdAt: 0, updatedAt: 0 }
		);
		if (!categories || categories.length == 0) {
			throw new AppError(
				categoryErrorMessages.CategoriesNotFound.message,
				categoryErrorMessages.CategoriesNotFound.statusCode
			);
		}
		return categories;
	};

	deleteById = async (catId) => {
		const category = await this.#CategoryRepository.deleteOneById(catId);
		if (!category) {
			throw new AppError(
				categoryErrorMessages.CategoriesNotFound.message,
				categoryErrorMessages.CategoriesNotFound.statusCode
			);
		}
	};

	checkExistCategory = async (categoryId) => {
		const category = await this.#CategoryRepository.findOneById(categoryId, { __v: 0, createdAt: 0, updatedAt: 0 });
		return category;
	};

	findCategoryChildWithNoChild = async (categoryId) => {
		const filterQuery = {
			parentsIdArray: { $in: categoryId },
			hasChild: false,
		};
		const categoryWithNoChild = await this.#CategoryRepository.find(filterQuery, {
			__v: 0,
			createdAt: 0,
			updatedAt: 0,
		});
		if (!categoryWithNoChild || categoryWithNoChild.length == 0) {
			throw new AppError(
				categoryErrorMessages.CategoriesNotFound.message,
				categoryErrorMessages.CategoriesNotFound.statusCode
			);
		}
		const categoryIds = [];
		for (const child of categoryWithNoChild) {
			categoryIds.push(child._id);
		}
		return categoryIds;
	};
}

export default new CategoryService();
