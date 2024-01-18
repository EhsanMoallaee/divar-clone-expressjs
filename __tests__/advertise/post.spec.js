import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import CategoryModel from '../../src/modules/category/model/category.model';
import ParameterModel from '../../src/modules/advertise/parameterModule/model/parameter.model.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import {
	createUser,
	postRequestWithAuth,
	postRequestWithAuthAndFile,
} from '../../src/common/testsFunctions/request.withAuth';

beforeAll(async () => {
	new ConnectMongodb();
});

beforeEach(async () => {
	await CategoryModel.deleteMany({});
	await ParameterModel.deleteMany({});
	await UserModel.deleteMany({});
});

afterEach(async () => {
	await CategoryModel.deleteMany({});
	await ParameterModel.deleteMany({});
	await UserModel.deleteMany({});
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
	postDTO.categoryId = categoryId;
	postDTO.parameters = parameters;
	return postDTO;
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
});
