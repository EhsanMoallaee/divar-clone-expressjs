import AppError from '../../errorHandling/app.error.js';
import CategoryService from '../../category/category.service.js';
import checkIncludesRequiredKeys from '../functions/checkIncludes.requiredKeys.js';
import checkKeysAreAllowed from '../functions/checkKeys.areAllowed.js';
import ParameterService from '../parameterModule/parameter.service.js';
import postErrorMessages from './messages/post.errorMessages.js';
import PostRepository from './model/post.repository.js';
import PostValidator from './validations/post.validator.js';
import { isValidObjectId } from 'mongoose';

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

	findByPostId = async (postId) => {
		if (!isValidObjectId(postId))
			throw new AppError(postErrorMessages.WrongPostId.message, postErrorMessages.WrongPostId.statusCode);
		const advertisePost = await this.#PostRepository.findOneById(postId, { updatedAt: 0 });
		if (!advertisePost)
			throw new AppError(
				postErrorMessages.AdvertisePostNotFound.message,
				postErrorMessages.AdvertisePostNotFound.statusCode
			);
		return advertisePost;
	};

	findByCategorySlug = async (categorySlug) => {
		if (!categorySlug)
			throw new AppError(
				postErrorMessages.CategorySlugIsMissing.message,
				postErrorMessages.CategorySlugIsMissing.statusCode
			);
		const category = await this.#CategoryService.findBySlug(categorySlug);
		let categorySlugs = [];
		if (!category.hasChild) {
			categorySlugs.push(category.slug);
		} else {
			categorySlugs = await this.#CategoryService.findCategoryChildWithNoChild(category._id);
		}
		const advertisePosts = [];
		for (const slug of categorySlugs) {
			const filterQuery = { 'directCategory.slug': slug };
			const posts = await this.#PostRepository.find(filterQuery, { updatedAt: 0 });
			if (posts && posts.length > 0) advertisePosts.push(...posts);
		}
		if (!advertisePosts || advertisePosts.length === 0)
			throw new AppError(
				postErrorMessages.AdvertisePostsNotFound.message,
				postErrorMessages.AdvertisePostsNotFound.statusCode
			);
		return advertisePosts;
	};

	findByAddress = async (province, city, district) => {
		if (!province)
			throw new AppError(
				postErrorMessages.ProvinceIsMissing.message,
				postErrorMessages.ProvinceIsMissing.statusCode
			);
		const filterQuery = {
			province,
		};
		if (city) filterQuery.city = city;
		if (city && district) filterQuery.district = district;
		const advertisePosts = await this.#PostRepository.find(filterQuery, { updatedAt: 0 });
		if (!advertisePosts || advertisePosts.length === 0)
			throw new AppError(
				postErrorMessages.AdvertisePostsNotFound.message,
				postErrorMessages.AdvertisePostsNotFound.statusCode
			);
		return advertisePosts;
	};

	findByCategorySlugAndAddress = async (categorySlug, province, city, district) => {
		if (!categorySlug)
			throw new AppError(
				postErrorMessages.CategorySlugIsMissing.message,
				postErrorMessages.CategorySlugIsMissing.statusCode
			);
		if (!province)
			throw new AppError(
				postErrorMessages.ProvinceIsMissing.message,
				postErrorMessages.ProvinceIsMissing.statusCode
			);
		const filterQuery = {
			'directCategory.slug': categorySlug,
			province,
		};
		if (city) filterQuery.city = city;
		if (district) filterQuery.district = district;
		const advertisePosts = await this.#PostRepository.find(filterQuery, { updatedAt: 0 });
		if (!advertisePosts || advertisePosts.length === 0)
			throw new AppError(
				postErrorMessages.AdvertisePostsNotFound.message,
				postErrorMessages.AdvertisePostsNotFound.statusCode
			);
		return advertisePosts;
	};
}

export default new PostService();
