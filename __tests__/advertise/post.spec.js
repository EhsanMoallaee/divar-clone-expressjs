import authenticationErrorMessages from '../../src/guards/messages/authentication.errorMessages.js';
import authorizationErrorMessages from '../../src/guards/messages/authorization.errorMessages.js';
import CategoryModel from '../../src/modules/category/model/category.model';
import ParameterModel from '../../src/modules/advertise/parameterModule/model/parameter.model.js';
import postErrorMessages from '../../src/modules/advertise/postModule/messages/post.errorMessages.js';
import PostModel from '../../src/modules/advertise/postModule/model/post.model.js';
import postSuccessMessages from '../../src/modules/advertise/postModule/messages/post.successMessages.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import { ConnectMongodb, disconnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import {
	createUser,
	deleteRequestWithAuth,
	deleteRequestWithoutAuth,
	getRequestWithAuth,
	postRequestWithAuth,
	postRequestWithAuthAndFile,
	postRequestWithoutAuth,
	userData,
} from '../../src/common/testsFunctions/request.withAuth';

beforeAll(async () => {
	new ConnectMongodb();
});

beforeEach(async () => {
	await CategoryModel.deleteMany({});
	await ParameterModel.deleteMany({});
	await PostModel.deleteMany({});
	await UserModel.deleteMany({});
});

afterEach(async () => {
	await CategoryModel.deleteMany({});
	await ParameterModel.deleteMany({});
	await PostModel.deleteMany({});
	await UserModel.deleteMany({});
});

afterAll(async () => {
	await disconnectMongodb();
});

const correctPostBaseDto = {
	title: 'post1-title',
	description: 'post1-description',
	province: 'post1-province',
	city: 'post1-city',
	district: 'post1-district',
	coordinate: [5, 5],
};

const firstParameterDto = {
	title: 'رنگ',
	key: 'color',
	type: 'string',
	enum: ['white', 'black', 'silver'],
	guide: 'Select the color',
};

const secondParameterDto = {
	title: 'سال',
	key: 'year',
	type: 'number',
	enum: ['1400', '1401', '1402'],
	guide: 'Select the year',
};

const requiedParameterDto = {
	title: 'متراژ',
	key: 'meterage',
	type: 'number',
	enum: [80, 120, 150],
	guide: 'Select the meterage',
	isRequired: true,
};

const correctCategory = {
	title: 'category-1',
	slug: 'category-1-slug',
	description: 'category-1-description',
};

const createCategory = async (categoryDto) => {
	const category = await CategoryModel.create(categoryDto);
	return category;
};

const createParameterData = async (parameterDTO, categoryId) => {
	parameterDTO.category = categoryId;
	return parameterDTO;
};

const createPostData = async (postDTO, categoryId, parameters) => {
	const dto = { ...postDTO };
	dto.categoryId = categoryId;
	dto.parameters = parameters;
	return dto;
};

const basePostUrl = '/api/v1/advertise/post';
const findPostByIdUrl = '/api/v1/advertise/post/by-id';
const findPostByCategorySlugUrl = '/api/v1/advertise/post/by-category-slug';
const findPostByAddresUrl = '/api/v1/advertise/post/by-address';
const findPostByCategorySlugAndAddresUrl = '/api/v1/advertise/post/by-categorySlug-address';
const baseParameterUrl = '/api/v1/advertise/parameter';

describe('Create advertise post tests', () => {
	it('Create Post: returns 201 with correct values and without images', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(201);
		expect(response.body.advertisePost.title).toBe(postDto.title);
		expect(response.body.advertisePost.description).toBe(postDto.description);
	});

	it('Create Post: returns 201 with correct values and with images', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;

		const secondParameterDTO = await createParameterData(secondParameterDto, categoryId);
		const secondParameterResponse = await postRequestWithAuth(secondParameterDTO, userId, baseParameterUrl);
		const secondParameter = secondParameterResponse.body.parameter;

		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
			[secondParameter.key]: secondParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const image = './__tests__/jest.png';
		const response = await postRequestWithAuthAndFile(postDto, userId, basePostUrl, image);

		expect(response.status).toBe(201);
		expect(response.body.advertisePost.title).toBe(postDto.title);
		expect(response.body.advertisePost.description).toBe(postDto.description);
		expect(response.body.advertisePost).toHaveProperty('imagesGallery');
		expect(response.body.advertisePost.imagesGallery.length).toBe(1);
	});

	it('Create Post: returns 401 for request by unauthenticated user', async () => {
		const adminUser = await createUser();
		const adminUserId = adminUser._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, adminUserId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const response = await postRequestWithoutAuth(postDto, basePostUrl);
		expect(response.status).toBe(authenticationErrorMessages.UnAuthenticated.statusCode);
		expect(response.body.message).toBe(authenticationErrorMessages.UnAuthenticated.message);
	});

	it('Create Post: returns 400 for sending request without title', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		delete postDto.title;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"title" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"title" is required'].message);
	});

	it('Create Post: returns 400 for sending request with empty string for title property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.title = '';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"title" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"title" is not allowed to be empty'].message);
	});

	it('Create Post: returns 400 for sending request with title as a number or string of digits', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.title = '1234';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages.TitleCouldNotBeJustNumbers.statusCode);
		expect(response.body.message).toBe(postErrorMessages.TitleCouldNotBeJustNumbers.message);
	});

	it('Create Post: returns 400 for sending request with title as a number or string of digits', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.title = 2;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"title" must be a string'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"title" must be a string'].message);
	});

	it('Create Post: returns 400 for sending request without description', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		delete postDto.description;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"description" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"description" is required'].message);
	});

	it('Create Post: returns 400 for sending request with empty string for description property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.description = '';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"description" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"description" is not allowed to be empty'].message);
	});

	it('Create Post: returns 400 for sending request without categoryId', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		delete postDto.categoryId;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"categoryId" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"categoryId" is required'].message);
	});

	it('Create Post: returns 400 for sending request with empty string for categoryId property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.categoryId = '';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"categoryId" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"categoryId" is not allowed to be empty'].message);
	});

	it('Create Post: returns 400 for sending request with wrong categoryId which is not exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const wrongCategoryId = firstParameterResponse.body.parameter._id;
		const postDto = await createPostData(correctPostBaseDto, wrongCategoryId, parameters);
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages.CategoryNotFound.statusCode);
		expect(response.body.message).toBe(postErrorMessages.CategoryNotFound.message);
	});

	it('Create Post: returns 400 for sending request without province', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		delete postDto.province;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"province" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"province" is required'].message);
	});

	it('Create Post: returns 400 for sending request with empty string for province property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.province = '';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"province" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"province" is not allowed to be empty'].message);
	});

	it('Create Post: returns 400 for sending request without city', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		delete postDto.city;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"city" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"city" is required'].message);
	});

	it('Create Post: returns 400 for sending request with empty string for city property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.city = '';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"city" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"city" is not allowed to be empty'].message);
	});

	it('Create Post: returns 400 for sending request without district', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};

		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		delete postDto.district;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"district" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"district" is required'].message);
	});

	it('Create Post: returns 400 for sending request with empty string for district property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.district = '';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"district" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"district" is not allowed to be empty'].message);
	});

	it('Create Post: returns 400 for sending request without parameters property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const postDto = await createPostData(correctPostBaseDto, categoryId);

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"parameters" is required'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"parameters" is required'].message);
	});

	it('Create Post: returns 400 for sending request with parameters property which is not an object', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const postDto = await createPostData(correctPostBaseDto, categoryId);
		postDto.parameters = ['sth'];

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"parameters" must be of type object'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"parameters" must be of type object'].message);
	});

	it('Create Post: returns 400 for sending request with parameters property which is an empty object', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const postDto = await createPostData(correctPostBaseDto, categoryId);
		postDto.parameters = {};

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"parameters" must have at least 1 key'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"parameters" must have at least 1 key'].message);
	});

	it('Create Post: returns 400 for sending request with parameters which is not exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameters = { someKey: 'some value' };
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages.ParameterIsNotAllowed.statusCode);
		expect(response.body.message).toBe(postErrorMessages.ParameterIsNotAllowed.message);
	});

	it('Create Post: returns 400 for sending request with category which has not any parameter', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameters = { someKey: 'some value' };
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages.ParametersNotFound.statusCode);
		expect(response.body.message).toBe(postErrorMessages.ParametersNotFound.message);
	});

	it('Create Post: returns 400 for sending request without required parameter in parameters field', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;

		const requiedParameterDTO = await createParameterData(requiedParameterDto, categoryId);
		await postRequestWithAuth(requiedParameterDTO, userId, baseParameterUrl);

		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages.RequiredParameterIsMissing.statusCode);
		expect(response.body.message).toBe(postErrorMessages.RequiredParameterIsMissing.message);
	});

	it('Create Post: returns 400 for sending request with coordinate as string type instead of array', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = '5,5';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"coordinate" must be an array'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"coordinate" must be an array'].message);
	});

	it('Create Post: returns 400 for sending request with coordinate whitout longitude', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = [5];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"coordinate" does not contain 1 required value(s)'].statusCode);
		expect(response.body.message).toBe(
			postErrorMessages['"coordinate" does not contain 1 required value(s)'].message
		);
	});

	it('Create Post: returns 400 for sending request with latitude as string', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = ['sth', 5];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"coordinate[0]" must be a number'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"coordinate[0]" must be a number'].message);
	});

	it('Create Post: returns 400 for sending request with longitude as string', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = [5, 'sth'];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"coordinate[1]" must be a number'].statusCode);
		expect(response.body.message).toBe(postErrorMessages['"coordinate[1]" must be a number'].message);
	});

	it('Create Post: returns 400 for sending request with latitude greater than 90', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = [90.1, 5];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"coordinate[0]" must be less than or equal to 90'].statusCode);
		expect(response.body.message).toBe(
			postErrorMessages['"coordinate[0]" must be less than or equal to 90'].message
		);
	});

	it('Create Post: returns 400 for sending request with latitude less than -90', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = [-90.1, 5];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(
			postErrorMessages['"coordinate[0]" must be greater than or equal to -90'].statusCode
		);
		expect(response.body.message).toBe(
			postErrorMessages['"coordinate[0]" must be greater than or equal to -90'].message
		);
	});

	it('Create Post: returns 400 for sending request with longitude greater than 180', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = [5, 180.1];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages['"coordinate[1]" must be less than or equal to 180'].statusCode);
		expect(response.body.message).toBe(
			postErrorMessages['"coordinate[1]" must be less than or equal to 180'].message
		);
	});

	it('Create Post: returns 400 for sending request with longitude less than -180', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.coordinate = [5, -180.1];
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(
			postErrorMessages['"coordinate[1]" must be greater than or equal to -180'].statusCode
		);
		expect(response.body.message).toBe(
			postErrorMessages['"coordinate[1]" must be greater than or equal to -180'].message
		);
	});

	it('Create Post: returns 400 for sending request with extra unallowed property', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const firstParameterDTO = await createParameterData(firstParameterDto, categoryId);
		const firstParameterResponse = await postRequestWithAuth(firstParameterDTO, userId, baseParameterUrl);
		const firstParameter = firstParameterResponse.body.parameter;
		const parameters = {
			[firstParameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		postDto.unAllowedProperty = 'sth';
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
		expect(response.status).toBe(postErrorMessages.FieldIsNotAllowed.statusCode);
		expect(response.body.message).toBe(postErrorMessages.FieldIsNotAllowed.message);
	});
});

describe('Find advertise post tests', () => {
	it('Find Post: returns 200 for finding post by id', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const createPostResponse = await postRequestWithAuth(postDto, userId, basePostUrl);
		const postId = createPostResponse.body.advertisePost._id;

		const url = `${findPostByIdUrl}/${postId}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(200);
		expect(findPostResponse.body.advertisePost.title).toBe(postDto.title);
		expect(findPostResponse.body.advertisePost.province).toBe(postDto.province);
		expect(findPostResponse.body.advertisePost.city).toBe(postDto.city);
	});

	it('Find Post: returns 404 for finding post by wrong id/doesnt exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByIdUrl}/${parameter._id}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.AdvertisePostNotFound.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.AdvertisePostNotFound.message);
	});

	it('Find Post: returns 404 for finding post by wrong id format', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByIdUrl}/1234`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.WrongPostId.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.WrongPostId.message);
	});

	it('Find Post: returns 200 for finding post by category slug', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByCategorySlugUrl}/${category.slug}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(200);
		expect(findPostResponse.body.advertisePosts[0].title).toBe(postDto.title);
		expect(findPostResponse.body.advertisePosts[0].province).toBe(postDto.province);
		expect(findPostResponse.body.advertisePosts[0].city).toBe(postDto.city);
	});

	it('Find Post: returns 404 for finding post by category slug which doesnt exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByCategorySlugUrl}/wrong-slug`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.CategoryNotFound.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.CategoryNotFound.message);
	});

	it('Find Post: returns 404 for finding post by category slug which has not any advertise post', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);

		const url = `${findPostByCategorySlugUrl}/${category.slug}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.AdvertisePostsNotFound.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.AdvertisePostsNotFound.message);
	});

	it('Find Post: returns 200 for finding post by address in query(province is required, city and district is optional)', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByAddresUrl}?province=${postDto.province}&city=${postDto.city}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(200);
		expect(findPostResponse.body.advertisePosts[0].title).toBe(postDto.title);
		expect(findPostResponse.body.advertisePosts[0].province).toBe(postDto.province);
		expect(findPostResponse.body.advertisePosts[0].city).toBe(postDto.city);
	});

	it('Find Post: returns 400 for finding post by address in query without province', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByAddresUrl}?city=${postDto.city}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.ProvinceIsMissing.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.ProvinceIsMissing.message);
	});

	it('Find Post: returns 404 for finding post by address in query with province which hasnt any advertise post', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByAddresUrl}?province=wrong-province`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.AdvertisePostsNotFound.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.AdvertisePostsNotFound.message);
	});

	it('Find Post: returns 200 for finding post by category slug and address in query(province is required, city and district is optional)', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByCategorySlugAndAddresUrl}?categorySlug=${category.slug}&province=${postDto.province}&city=${postDto.city}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(200);
		expect(findPostResponse.body.advertisePosts[0].title).toBe(postDto.title);
		expect(findPostResponse.body.advertisePosts[0].province).toBe(postDto.province);
		expect(findPostResponse.body.advertisePosts[0].city).toBe(postDto.city);
	});

	it('Find Post: returns 400 for finding post by category slug and address in query without sending category slug', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByCategorySlugAndAddresUrl}?province=${postDto.province}&city=${postDto.city}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.CategorySlugIsMissing.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.CategorySlugIsMissing.message);
	});

	it('Find Post: returns 400 for finding post by category slug and address in query without sending province slug', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);
		await postRequestWithAuth(postDto, userId, basePostUrl);

		const url = `${findPostByCategorySlugAndAddresUrl}?categorySlug=${category.slug}&city=${postDto.city}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.ProvinceIsMissing.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.ProvinceIsMissing.message);
	});

	it('Find Post: returns 404 for finding post by category slug and address in query which doesnt exist any post for them', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);

		const url = `${findPostByCategorySlugAndAddresUrl}?categorySlug=${category.slug}&province=${correctPostBaseDto.province}`;
		const findPostResponse = await getRequestWithAuth(userId, {}, url);
		expect(findPostResponse.status).toBe(postErrorMessages.AdvertisePostsNotFound.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.AdvertisePostsNotFound.message);
	});
});

describe('Delete advertise post tests', () => {
	it('Delete Post: returns 200 for deleting post by id', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const createPostResponse = await postRequestWithAuth(postDto, userId, basePostUrl);
		const postId = createPostResponse.body.advertisePost._id;

		const url = `${basePostUrl}/${postId}`;
		const response = await deleteRequestWithAuth(userId, url);
		expect(response.status).toBe(postSuccessMessages.PostDeletedSuccessfully.statusCode);
		expect(response.body.message).toBe(postSuccessMessages.PostDeletedSuccessfully.message);
	});

	it('Delete Post: returns 401 for request by unauthenticated user', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const createPostResponse = await postRequestWithAuth(postDto, userId, basePostUrl);
		const postId = createPostResponse.body.advertisePost._id;

		const url = `${basePostUrl}/${postId}`;
		const response = await deleteRequestWithoutAuth(url);
		expect(response.status).toBe(authenticationErrorMessages.UnAuthenticated.statusCode);
		expect(response.body.message).toBe(authenticationErrorMessages.UnAuthenticated.message);
	});

	it('Delete Post: returns 403 for request by unauthorized user', async () => {
		const adminUser = await createUser();
		const adminUserId = adminUser._id;
		const user = await createUser(userData);
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const parameterDTO = await createParameterData(firstParameterDto, categoryId);
		const parameterResponse = await postRequestWithAuth(parameterDTO, adminUserId, baseParameterUrl);
		const parameter = parameterResponse.body.parameter;
		const parameters = {
			[parameter.key]: firstParameterDto.enum[0],
		};
		const postDto = await createPostData(correctPostBaseDto, categoryId, parameters);

		const createPostResponse = await postRequestWithAuth(postDto, userId, basePostUrl);
		const postId = createPostResponse.body.advertisePost._id;

		const url = `${basePostUrl}/${postId}`;
		const response = await deleteRequestWithAuth(userId, url);
		expect(response.status).toBe(authorizationErrorMessages.UnAuthorized.statusCode);
		expect(response.body.message).toBe(authorizationErrorMessages.UnAuthorized.message);
	});

	it('Delete Post: returns 404 for deleting post by wrong id/doesnt exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;

		const url = `${basePostUrl}/${categoryId}`;
		const findPostResponse = await deleteRequestWithAuth(userId, url);
		expect(findPostResponse.status).toBe(postErrorMessages.AdvertisePostNotFound.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.AdvertisePostNotFound.message);
	});

	it('Delete Post: returns 400 for deleting post by wrong id format', async () => {
		const user = await createUser();
		const userId = user._id;

		const url = `${basePostUrl}/1234}`;
		const findPostResponse = await deleteRequestWithAuth(userId, url);
		expect(findPostResponse.status).toBe(postErrorMessages.WrongPostId.statusCode);
		expect(findPostResponse.body.message).toBe(postErrorMessages.WrongPostId.message);
	});
});
