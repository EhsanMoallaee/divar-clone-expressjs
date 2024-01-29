import AppError from '../../errorHandling/app.error.js';
import CategoryService from '../../category/category.service.js';
import checkIncludesRequiredKeys from '../functions/checkIncludes.requiredKeys.js';
import checkKeysAreAllowed from '../functions/checkKeys.areAllowed.js';
import makeImagesUrlArray from '../functions/make.imagesUrlArray.js';
import makePostParameters from '../functions/make.postParameters.js';
import ParameterService from '../parameterModule/parameter.service.js';
import postErrorMessages from './messages/post.errorMessages.js';
import PostRepository from './model/post.repository.js';
import PostValidator from './validators/post.validator.js';
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

	create = async (data, files, user) => {
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
		const category = await this.#CategoryService.findById(data.categoryId);
		if (!category)
			throw new AppError(
				postErrorMessages.CategoryNotFound.message,
				postErrorMessages.CategoryNotFound.statusCode
			);
		const directCategory = {
			id: category._id,
			title: category.title,
			slug: category.slug,
		};

		const imagesUrlArray = await makeImagesUrlArray(files);
		const parameters = await this.#ParameterService.findByCategoryId(category._id);
		const allowedParametersKeys = parameters.map((param) => param.key);
		const parametersKeysInData = [...Object.keys(data.parameters)];
		await checkKeysAreAllowed(parametersKeysInData, allowedParametersKeys);
		await checkIncludesRequiredKeys(parameters, data.parameters);
		const postParameters = await makePostParameters(parameters, data.parameters);

		const postDTO = {
			...data,
			user: {
				id: user._id,
				mobile: user.mobile,
			},
			directCategory,
			imagesGallery: imagesUrlArray,
			parameters: postParameters,
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
		const categoryIds = await this.findRelatedHasNoChildrenCategoryIds(category);
		const advertisePosts = await this.findAdvertisePosts(categoryIds);
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
		const conditions = {
			province,
		};
		if (city) conditions.city = city;
		if (city && district) conditions.district = district;
		const advertisePosts = await this.findAdvertisePosts([], conditions);
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
		const category = await this.#CategoryService.findBySlug(categorySlug);
		const categoryIds = await this.findRelatedHasNoChildrenCategoryIds(category);
		const conditions = { province, city, district };
		const advertisePosts = await this.findAdvertisePosts(categoryIds, conditions);
		if (!advertisePosts || advertisePosts.length === 0)
			throw new AppError(
				postErrorMessages.AdvertisePostsNotFound.message,
				postErrorMessages.AdvertisePostsNotFound.statusCode
			);
		return advertisePosts;
	};

	fetchAll = async () => {
		const advertisePosts = await this.#PostRepository.find();
		if (!advertisePosts || advertisePosts.length === 0)
			throw new AppError(
				postErrorMessages.AdvertisePostsNotFound.message,
				postErrorMessages.AdvertisePostsNotFound.statusCode
			);
		return advertisePosts;
	};

	myPosts = async (user) => {
		const userId = user._id;
		const filterQuery = { 'user.id': userId };
		const advertisePosts = await this.#PostRepository.find(filterQuery);
		if (!advertisePosts || advertisePosts.length === 0)
			throw new AppError(
				postErrorMessages.YouHaveNotAnyRegisteredPost.message,
				postErrorMessages.YouHaveNotAnyRegisteredPost.statusCode
			);
		return advertisePosts;
	};

	confirmPost = async (confirmData) => {
		const { error } = PostValidator.confirmPostValidator(confirmData);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.startsWith('"postId" with value')) {
				throw new AppError(postErrorMessages.WrongPostId.message, postErrorMessages.WrongPostId.statusCode);
			} else if (postErrorMessages[errorMessage]) {
				throw new AppError(postErrorMessages[errorMessage].message, postErrorMessages[errorMessage].statusCode);
			} else {
				throw new AppError(
					postErrorMessages.ExceptionError.message,
					postErrorMessages.ExceptionError.statusCode
				);
			}
		}
		const postId = confirmData.postId;
		const isConfirmed = confirmData.isConfirmed;
		const result = await this.#PostRepository.update(postId, { isConfirmed });
		if (!result)
			throw new AppError(
				postErrorMessages.AdvertisePostNotFound.message,
				postErrorMessages.AdvertisePostNotFound.statusCode
			);
		return true;
	};

	delete = async (postId) => {
		if (!isValidObjectId(postId))
			throw new AppError(postErrorMessages.WrongPostId.message, postErrorMessages.WrongPostId.statusCode);
		const result = await this.#PostRepository.deleteOneById(postId);
		if (!result)
			throw new AppError(
				postErrorMessages.AdvertisePostNotFound.message,
				postErrorMessages.AdvertisePostNotFound.statusCode
			);
		return result;
	};

	findRelatedHasNoChildrenCategoryIds = async (category) => {
		let categoryIds = [];
		if (!category.hasChildren) {
			categoryIds.push(category._id);
		} else {
			categoryIds = await this.#CategoryService.findCategoryChildWithNoChildren(category._id);
		}
		return categoryIds;
	};

	findAdvertisePosts = async (categoryIds, conditions) => {
		let advertisePosts = [];
		let filterQuery = {};
		if (conditions && Object.keys(conditions).length > 0) {
			Object.keys(conditions).forEach((key) => conditions[key] == null && delete conditions[key]);
			filterQuery = {
				...conditions,
			};
		}
		filterQuery.isConfirmed = true;
		if (categoryIds && categoryIds.length > 0) {
			for (const id of categoryIds) {
				filterQuery['directCategory.id'] = id;
				const posts = await this.#PostRepository.find(filterQuery, { updatedAt: 0 });
				if (posts && posts.length > 0) advertisePosts.push(...posts);
			}
		} else {
			advertisePosts = await this.#PostRepository.find(filterQuery, { updatedAt: 0 });
		}
		return advertisePosts;
	};
}

export default new PostService();
