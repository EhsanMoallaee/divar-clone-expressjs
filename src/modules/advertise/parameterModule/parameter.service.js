import slugify from 'slugify';
import AppError from '../../errorHandling/app.error.js';
import CategoryRepository from '../../category/model/category.repository.js';
import parameterErrorMessages from './messages/parameter.errorMessages.js';
import ParameterRepository from './model/parameter.repository.js';
import parameterValidator from './validators/parameter.validator.js';

class ParameterService {
	#CategoryRepository;
	#ParameterRepository;
	constructor() {
		this.#CategoryRepository = CategoryRepository;
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
		const category = await this.checkExistCategory(parameterDTO.category);
		parameterDTO.key = slugify(parameterDTO.key, { replacement: '_', trim: true, lower: true });
		await this.checkExistOptionByKeyAndCategory(category, parameterDTO.key);
		if (parameterDTO?.enum && typeof parameterDTO.enum === 'string') {
			parameterDTO.enum = parameterDTO.enum.split(',');
		} else if (!Array.isArray(parameterDTO.enum)) parameterDTO.enum = [];
		const parameter = await this.#ParameterRepository.create(parameterDTO);
		return parameter;
	};

	findById = async (parameterId) => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameter = await this.#ParameterRepository.findOneById(parameterId, { __v: 0 }, populate);
		if (!parameter)
			throw new AppError(
				parameterErrorMessages.ParameterDidntFound.message,
				parameterErrorMessages.ParameterDidntFound.statusCode
			);
		return parameter;
	};

	findByCategoryId = async (categoryId) => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameters = await this.#ParameterRepository.find({ category: categoryId }, { __v: 0 }, populate);
		if (!parameters || parameters.length === 0)
			throw new AppError(
				parameterErrorMessages.ParametersDidntFound.message,
				parameterErrorMessages.ParametersDidntFound.statusCode
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
				parameterErrorMessages.ParametersDidntFound.message,
				parameterErrorMessages.ParametersDidntFound.statusCode
			);
		return parameters;
	};

	fetchAll = async () => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameters = await this.#ParameterRepository.find({}, { __v: 0 }, populate);
		if (!parameters || parameters.length === 0)
			throw new AppError(
				parameterErrorMessages.ParametersDidntFound.message,
				parameterErrorMessages.ParametersDidntFound.statusCode
			);
		return parameters;
	};

	delete = async (parameterId) => {
		const result = await this.#ParameterRepository.deleteOneById(parameterId);
		if (!result)
			throw new AppError(
				parameterErrorMessages.ParameterDidntFound.message,
				parameterErrorMessages.ParameterDidntFound.statusCode
			);
		return result;
	};

	checkExistCategory = async (categoryId) => {
		const category = await this.#CategoryRepository.findOneById(categoryId);
		if (!category)
			throw new AppError(
				parameterErrorMessages.CategoryDidntFound.message,
				parameterErrorMessages.CategoryDidntFound.statusCode
			);
		return category;
	};

	checkExistOptionByKeyAndCategory = async (category, key) => {
		const parameter = await this.#ParameterRepository.findOne({ category, key });
		if (parameter)
			throw new AppError(
				parameterErrorMessages.OptionWithKeyAndCategoryAlreadyExist.message,
				parameterErrorMessages.OptionWithKeyAndCategoryAlreadyExist.statusCode
			);
		return true;
	};
}

export default new ParameterService();
