import slugify from 'slugify';
import AppError from '../../errorHandling/app.error.js';
import CategoryRepository from '../../category/model/category.repository.js';
import parameterErrorMessages from './messages/parameter.errorMessages.js';
import ParameterRepository from './model/parameter.repository.js';

class ParameterService {
	#CategoryRepository;
	#ParameterRepository;
	constructor() {
		this.#CategoryRepository = CategoryRepository;
		this.#ParameterRepository = ParameterRepository;
	}

	create = async (parameterDTO) => {
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

	fetchAll = async () => {
		const populate = [{ path: 'category', select: { title: 1, slug: 1 } }];
		const parameters = await this.#ParameterRepository.find({}, { __v: 0 }, populate);
		return parameters;
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
		return null;
	};
}

export default new ParameterService();
