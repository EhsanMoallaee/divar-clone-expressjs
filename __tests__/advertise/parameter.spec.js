import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import CategoryModel from '../../src/modules/category/model/category.model';
import ParameterModel from '../../src/modules/advertise/parameterModule/model/parameter.model.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import parameterErrorMessages from '../../src/modules/advertise/parameterModule/messages/parameter.errorMessages.js';
import parameterSuccessMessages from '../../src/modules/advertise/parameterModule/messages/parameter.successMessages.js';
import {
	createUser,
	deleteRequestWithAuth,
	getRequestWithAuth,
	postRequestWithAuth,
} from '../../src/common/testsFunctions/request.withAuth.js';

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

const correctParameter = {
	title: 'رنگ',
	key: 'color',
	type: 'string',
	enum: ['white', 'black', 'silver'],
	guide: 'Select the color',
};

const correctCategory = {
	title: 'category-1',
	slug: 'category-1-slug',
	description: 'category-1-description',
};

const createParameterData = async (parameterDTO) => {
	const user = await createUser();
	const category = await CategoryModel.create(correctCategory);
	parameterDTO.category = category._id;
	return { parameterDTO, userId: user._id, category };
};

const baseParameterUrl = '/api/v1/advertise/parameter';
const findParameterByIdUrl = '/api/v1/advertise/parameter/by-id';
const findParameterByCategoryIdUrl = '/api/v1/advertise/parameter/by-category-id';
const findParameterByCategorySlugUrl = '/api/v1/advertise/parameter/by-category-slug';

describe('Advertise parameter module tests', () => {
	it('Create parameter: returns 201 with correct values', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const response = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		expect(response.status).toBe(201);
		expect(response.body.parameter.title).toBe(correctParameter.title);
		expect(response.body.parameter.key).toBe(correctParameter.key);
	});

	it('Create parameter: returns 400 with empty title', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameterDtoWithEmptyTitle = JSON.parse(JSON.stringify(parameterDTO));
		parameterDtoWithEmptyTitle.title = '';
		const response = await postRequestWithAuth(parameterDtoWithEmptyTitle, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"title" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"title" is not allowed to be empty'].message);
	});

	it('Create parameter: returns 400 without title', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameterDtoWithoutTitle = JSON.parse(JSON.stringify(parameterDTO));
		delete parameterDtoWithoutTitle.title;
		const response = await postRequestWithAuth(parameterDtoWithoutTitle, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"title" is required'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"title" is required'].message);
	});

	it('Create parameter: returns 400 with empty key', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameterDtoWithEmptyKey = JSON.parse(JSON.stringify(parameterDTO));
		parameterDtoWithEmptyKey.key = '';
		const response = await postRequestWithAuth(parameterDtoWithEmptyKey, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"key" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"key" is not allowed to be empty'].message);
	});

	it('Create parameter: returns 400 without key', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameterDtoWithoutKey = JSON.parse(JSON.stringify(parameterDTO));
		delete parameterDtoWithoutKey.key;
		const response = await postRequestWithAuth(parameterDtoWithoutKey, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"key" is required'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"key" is required'].message);
	});

	it('Create parameter: returns 409 for create parameter with duplicate category and key', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		await ParameterModel.create(parameterDTO);
		const parameterWithDuplicateCatAndKey = JSON.parse(JSON.stringify(parameterDTO));
		parameterWithDuplicateCatAndKey.title = 'new title';
		parameterWithDuplicateCatAndKey.enum = ['new enum1', 'new enum2'];
		const response = await postRequestWithAuth(parameterWithDuplicateCatAndKey, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages.OptionWithKeyAndCategoryAlreadyExist.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.OptionWithKeyAndCategoryAlreadyExist.message);
	});

	it('Find parameter: returns 200 for find parameter with id', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${findParameterByIdUrl}/${parameter._id}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(200);
	});

	it('Find parameter: returns 404 for find parameter with wrong id', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${findParameterByIdUrl}/${parameter._id}`;
		await ParameterModel.deleteOne({ _id: parameter._id });
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(parameterErrorMessages.ParameterDidntFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterDidntFound.message);
	});

	it('Find parameter: returns 200 for find parameter with category id', async () => {
		const { parameterDTO, userId, category } = await createParameterData(correctParameter);
		await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategoryIdUrl}/${category._id}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(200);
	});

	it('Find parameter: returns 404 for find parameter with wrong category id', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategoryIdUrl}/${parameter._id}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(parameterErrorMessages.ParametersDidntFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParametersDidntFound.message);
	});

	it('Find parameter: returns 200 for find parameter with category slug', async () => {
		const { parameterDTO, userId, category } = await createParameterData(correctParameter);
		await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategorySlugUrl}/${category.slug}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(200);
	});

	it('Find parameter: returns 404 for find parameter with wrong category slug', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategorySlugUrl}/${'wrong-slug'}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(parameterErrorMessages.ParametersDidntFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParametersDidntFound.message);
	});

	it('Find parameter: returns 200 for find all parameters', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameter = await ParameterModel.create(parameterDTO);
		const response = await getRequestWithAuth(userId, {}, baseParameterUrl);
		expect(response.status).toBe(200);
		expect(response.body.parameters.length).toBe(1);
		expect(response.body.parameters[0].title).toBe(parameter.title);
	});

	it('Find parameter: returns 404 for dont find any parameter in fetch all route', async () => {
		const { userId } = await createParameterData(correctParameter);
		const response = await getRequestWithAuth(userId, {}, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages.ParametersDidntFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParametersDidntFound.message);
	});

	it('Find parameter: returns 200 for delete a parameter', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${baseParameterUrl}/${parameter._id}`;
		const response = await deleteRequestWithAuth(userId, url);
		expect(response.status).toBe(parameterSuccessMessages.ParameterDeletedSuccessfully.statusCode);
		expect(response.body.message).toBe(parameterSuccessMessages.ParameterDeletedSuccessfully.message);
	});

	it('Find parameter: returns 404 for delete a parameter with wrong id', async () => {
		const { parameterDTO, userId } = await createParameterData(correctParameter);
		await ParameterModel.create(parameterDTO);
		const url = `${baseParameterUrl}/${userId}`;
		const response = await deleteRequestWithAuth(userId, url);
		expect(response.status).toBe(parameterErrorMessages.ParameterDidntFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterDidntFound.message);
	});
});
