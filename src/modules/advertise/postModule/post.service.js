import AppError from '../../errorHandling/app.error.js';
import CategoryService from '../../category/category.service.js';
import checkIncludesRequiredKeys from '../functions/checkIncludes.requiredKeys.js';
import checkKeysAreAllowed from '../functions/checkKeys.areAllowed.js';
import ParameterService from '../parameterModule/parameter.service.js';
import postErrorMessages from './messages/post.errorMessages.js';
import PostRepository from './model/post.repository.js';
import PostValidator from './validations/post.validator.js';

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
		const { error } = PostValidator.createPostValidator(data);
		if (error) {
			const errorMessage = error.message;
			console.log('🚀 ~ PostService ~ create= ~ errorMessage:', errorMessage);
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					postErrorMessages.FieldIsNotAllowed.message,
					postErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (errorMessage.startsWith('"title" with value')) {
				throw new AppError(
					postErrorMessages.TitleCouldNotBeJustNumbers.message,
					postErrorMessages.TitleCouldNotBeJustNumbers.statusCode
				);
			} else if (postErrorMessages[errorMessage]) {
				throw new AppError(postErrorMessages[errorMessage].message, postErrorMessages[errorMessage].statusCode);
			} else {
				throw new AppError(
					postErrorMessages.ExceptionError.message,
					postErrorMessages.ExceptionError.statusCode
				);
			}
		}
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
