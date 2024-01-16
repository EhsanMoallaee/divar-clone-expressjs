import AppError from '../../errorHandling/app.error.js';
import CategoryService from '../../category/category.service.js';
import checkIncludesRequiredKeys from '../functions/checkIncludes.requiredKeys.js';
import checkKeysAreAllowed from '../functions/checkKeys.areAllowed.js';
import ParameterService from '../parameterModule/parameter.service.js';
import postErrorMessages from './messages/post.errorMessages.js';
import PostRepository from './model/post.repository.js';

class PostService {
	#CategoryService;
	#ParameterService;
	#PostRepository;
	constructor() {
		this.#CategoryService = CategoryService;
		this.#ParameterService = ParameterService;
		this.#PostRepository = PostRepository;
	}

	create = async (data, files) => {
		const imagesUrl = files.map((file) => {
			return { url: file.path };
		});

		const category = await this.#CategoryService.findById(data.categoryId);
		if (!category)
			throw new AppError(
				postErrorMessages.CategoryNotFound.message,
				postErrorMessages.CategoryNotFound.statusCode
			);
		const directCategory = {
			category: category._id,
			title: category.title,
			slug: category.slug,
		};
		const parameters = await this.#ParameterService.findByCategoryId(category._id);
		const allowedKeys = parameters.map((param) => param.key);
		const parametersInData = [...Object.keys(data.parameters)];

		await checkKeysAreAllowed(parametersInData, allowedKeys);
		await checkIncludesRequiredKeys(parameters, data);
		const postDTO = {
			...data,
			directCategory,
			imagesGallery: imagesUrl,
		};
		delete postDTO.categoryId;
		const advertisePost = await this.#PostRepository.create(postDTO);
		return advertisePost;
	};
}

export default new PostService();
