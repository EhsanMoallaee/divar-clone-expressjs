import { ConnectMongodb, disconnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import CategoryModel from '../../src/modules/category/model/category.model';
import ParameterModel from '../../src/modules/advertise/parameterModule/model/parameter.model.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import {
	createUser,
	postRequestWithAuth,
	postRequestWithAuthAndFile,
	userData,
} from '../../src/common/testsFunctions/request.withAuth';
import PostModel from '../../src/modules/advertise/postModule/model/post.model.js';
import postErrorMessages from '../../src/modules/advertise/postModule/messages/post.errorMessages.js';
import authorizationErrorMessages from '../../src/guards/messages/authorization.errorMessages.js';
import authenticationErrorMessages from '../../src/guards/messages/authentication.errorMessages.js';

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
const baseParameterUrl = '/api/v1/advertise/parameter';

describe('Advertise post module tests', () => {
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

		const userId = categoryId;
		const response = await postRequestWithAuth(postDto, userId, basePostUrl);
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
