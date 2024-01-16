import slugify from 'slugify';
import { isValidObjectId } from 'mongoose';

import AppError from '../../errorHandling/app.error.js';
import parameterErrorMessages from './messages/parameter.errorMessages.js';
import ParameterRepository from './model/parameter.repository.js';
import parameterValidator from './validators/parameter.validator.js';
import categoryService from '../../category/category.service.js';

class ParameterService {
	#CategoryService;
	#ParameterRepository;
	constructor() {
		this.#CategoryService = categoryService;
		this.#ParameterRepository = ParameterRepository;
	}

	create = async (parameterDTO) => {
		const { error } = parameterValidator.createParameterValidator(parameterDTO);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					parameterErrorMessages.FieldIsNotAllowed.message,
					parameterErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (parameterErrorMessages[errorMessage]) {
				throw new AppError(
					parameterErrorMessages[errorMessage].message,
					parameterErrorMessages[errorMessage].statusCode
				);
			} else {
				throw new AppError(
					parameterErrorMessages.ExceptionError.message,
					parameterErrorMessages.ExceptionError.statusCode
				);
			}
		}
		const category = await this.#CategoryService.checkExistCategory(parameterDTO.category);
		if (!category)
			throw new AppError(
				parameterErrorMessages.CategoryNotFound.message,
				parameterErrorMessages.CategoryNotFound.statusCode
			);
		if (category.hasChild)
			throw new AppError(
				parameterErrorMessages.CategoryHasChild.message,
				parameterErrorMessages.CategoryHasChild.statusCode
			);
		slugify.extend({ '-': '_' });
		parameterDTO.key = slugify(parameterDTO.key, {
			remove: /[*+~.()'"!?^#&:@]/g,
			replacement: '_',
			trim: true,
			lower: true,
		});
		// parameterDTO.key = slugify(parameterDTO.key, { replacement: '_', trim: true, lower: true });
		await this.checkExistParameterByKeyAndCategory(category, parameterDTO.key);
		if (parameterDTO?.enum) parameterDTO.enum = await this.convertEnumToArray(parameterDTO.enum);
		const parameter = await this.#ParameterRepository.create(parameterDTO);
		return parameter;
	};

	findById = async (parameterId) => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameter = await this.#ParameterRepository.findOneById(parameterId, { __v: 0 }, populate);
		if (!parameter)
			throw new AppError(
				parameterErrorMessages.ParameterNotFound.message,
				parameterErrorMessages.ParameterNotFound.statusCode
			);
		return parameter;
	};

	findByCategoryId = async (categoryId) => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameters = await this.#ParameterRepository.find({ category: categoryId }, { __v: 0 }, populate);
		if (!parameters || parameters.length === 0)
			throw new AppError(
				parameterErrorMessages.ParametersNotFound.message,
				parameterErrorMessages.ParametersNotFound.statusCode
			);
		return parameters;
	};

	findByCategorySlug = async (categorySlug) => {
		const aggregate = [
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$unwind: '$category',
			},
			{
				$addFields: {
					categoryTitle: '$category.title',
					categorySlug: '$category.slug',
					categoryIcon: '$category.icon',
				},
			},
			{
				$project: {
					category: 0,
					__v: 0,
				},
			},
			{
				$match: {
					categorySlug,
				},
			},
		];
		const parameters = await this.#ParameterRepository.aggregate(aggregate);
		if (!parameters || parameters.length === 0)
			throw new AppError(
				parameterErrorMessages.ParametersNotFound.message,
				parameterErrorMessages.ParametersNotFound.statusCode
			);
		return parameters;
	};

	fetchAll = async () => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameters = await this.#ParameterRepository.find({}, { __v: 0 }, populate);
		if (!parameters || parameters.length === 0)
			throw new AppError(
				parameterErrorMessages.ParametersNotFound.message,
				parameterErrorMessages.ParametersNotFound.statusCode
			);
		return parameters;
	};

	update = async (parameterId, updateDTO) => {
		const { error } = parameterValidator.updateParameterValidator(updateDTO);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					parameterErrorMessages.FieldIsNotAllowed.message,
					parameterErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (parameterErrorMessages[errorMessage]) {
				throw new AppError(
					parameterErrorMessages[errorMessage].message,
					parameterErrorMessages[errorMessage].statusCode
				);
			} else {
				throw new AppError(
					parameterErrorMessages.ExceptionError.message,
					parameterErrorMessages.ExceptionError.statusCode
				);
			}
		}
		let parameter;
		if (!isValidObjectId(parameterId)) {
			throw new AppError(
				parameterErrorMessages.WrongParameterId.message,
				parameterErrorMessages.WrongParameterId.statusCode
			);
		} else {
			parameter = await this.findById(parameterId);
		}
		if (updateDTO.category && isValidObjectId(updateDTO.category)) {
			const category = await this.#CategoryService.checkExistCategory(updateDTO.category);
			if (!category)
				throw new AppError(
					parameterErrorMessages.CategoryNotFound.message,
					parameterErrorMessages.CategoryNotFound.statusCode
				);
		}
		if (updateDTO.key) updateDTO.key = slugify(updateDTO.key, { replacement: '_', trim: true, lower: true });
		if (updateDTO.key || updateDTO.category)
			await this.checkExistParameterByKeyAndCategory(
				updateDTO.category || parameter.category,
				updateDTO.key || parameter.key
			);
		if (updateDTO?.enum) updateDTO.enum = await this.convertEnumToArray(updateDTO.enum);

		const updatedParameter = await this.#ParameterRepository.update(
			parameterId,
			{ $set: updateDTO },
			{ new: true }
		);
		return updatedParameter;
	};

	delete = async (parameterId) => {
		const result = await this.#ParameterRepository.deleteOneById(parameterId);
		if (!result)
			throw new AppError(
				parameterErrorMessages.ParameterNotFound.message,
				parameterErrorMessages.ParameterNotFound.statusCode
			);
		return result;
	};

	checkExistParameterByKeyAndCategory = async (category, key) => {
		const parameter = await this.#ParameterRepository.findOne({ category, key });
		if (parameter)
			throw new AppError(
				parameterErrorMessages.ParameterWithKeyAndCategoryAlreadyExist.message,
				parameterErrorMessages.ParameterWithKeyAndCategoryAlreadyExist.statusCode
			);
		return true;
	};

	convertEnumToArray = async (enumData) => {
		if (typeof enumData === 'string') {
			enumData = enumData.split(',');
		} else if (!Array.isArray(enumData)) enumData = [];
		return enumData;
	};
}

export default new ParameterService();
