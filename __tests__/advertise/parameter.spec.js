import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import CategoryModel from '../../src/modules/category/model/category.model';
import parameterErrorMessages from '../../src/modules/advertise/parameterModule/messages/parameter.errorMessages.js';
import parameterSuccessMessages from '../../src/modules/advertise/parameterModule/messages/parameter.successMessages.js';
import ParameterModel from '../../src/modules/advertise/parameterModule/model/parameter.model.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import {
	createUser,
	deleteRequestWithAuth,
	getRequestWithAuth,
	patchRequestWithAuth,
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

const correctParameterDto = {
	title: 'رنگ',
	key: 'color',
	type: 'string',
	enum: ['white', 'black', 'silver'],
	guide: 'Select the color',
};

const secondCorrectParameterDto = {
	title: 'title',
	key: 'year',
	type: 'number',
	enum: [2020, 2021, 2022, 2023],
	guide: 'Select the year',
};

const correctUpdateParameterDto = {
	title: 'update title',
	key: 'update_key',
	type: 'string',
	enum: ['white', 'black', 'silver'],
	guide: 'Select from enum',
};

const correctCategory = {
	title: 'category-1',
	slug: 'category-1-slug',
	description: 'category-1-description',
};

const secondCorrectCategory = {
	title: 'category-2',
	slug: 'category-2-slug',
	description: 'category-2-description',
};

const createCategory = async (categoryDto) => {
	const category = await CategoryModel.create(categoryDto);
	return category;
};

const createParameterData = async (parameterDTO, categoryId) => {
	parameterDTO.category = categoryId;
	return parameterDTO;
};

const baseParameterUrl = '/api/v1/advertise/parameter';
const findParameterByIdUrl = '/api/v1/advertise/parameter/by-id';
const findParameterByCategoryIdUrl = '/api/v1/advertise/parameter/by-category-id';
const findParameterByCategorySlugUrl = '/api/v1/advertise/parameter/by-category-slug';

describe('Advertise parameter module tests', () => {
	it('Create parameter: returns 201 for request with correct values', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const response = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		expect(response.status).toBe(201);
		expect(response.body.parameter.title).toBe(correctParameterDto.title);
		expect(response.body.parameter.key).toBe(correctParameterDto.key);
	});

	it('Create parameter: returns 400 for request with empty title', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameterDtoWithEmptyTitle = JSON.parse(JSON.stringify(parameterDTO));
		parameterDtoWithEmptyTitle.title = '';
		const response = await postRequestWithAuth(parameterDtoWithEmptyTitle, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"title" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"title" is not allowed to be empty'].message);
	});

	it('Create parameter: returns 400 for request without title', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameterDtoWithoutTitle = JSON.parse(JSON.stringify(parameterDTO));
		delete parameterDtoWithoutTitle.title;
		const response = await postRequestWithAuth(parameterDtoWithoutTitle, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"title" is required'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"title" is required'].message);
	});

	it('Create parameter: returns 400 for request with empty key', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameterDtoWithEmptyKey = JSON.parse(JSON.stringify(parameterDTO));
		parameterDtoWithEmptyKey.key = '';
		const response = await postRequestWithAuth(parameterDtoWithEmptyKey, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"key" is not allowed to be empty'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"key" is not allowed to be empty'].message);
	});

	it('Create parameter: returns 400 for request without key', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameterDtoWithoutKey = JSON.parse(JSON.stringify(parameterDTO));
		delete parameterDtoWithoutKey.key;
		const response = await postRequestWithAuth(parameterDtoWithoutKey, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages['"key" is required'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"key" is required'].message);
	});

	it('Create parameter: returns 400 for create a parameter for a category which has child/children', async () => {
		const user = await createUser();
		const userId = user._id;
		const parentCategory = await createCategory({ ...correctCategory, hasChildren: true });
		const parentCategoryId = parentCategory._id;

		const parameterDTO = await createParameterData(correctParameterDto, parentCategoryId);
		const response = await postRequestWithAuth(parameterDTO, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages.CategoryHasChild.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.CategoryHasChild.message);
	});

	it('Create parameter: returns 409 for create parameter with duplicate category and key', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		await ParameterModel.create(parameterDTO);
		const parameterWithDuplicateCatAndKey = JSON.parse(JSON.stringify(parameterDTO));
		parameterWithDuplicateCatAndKey.title = 'new title';
		parameterWithDuplicateCatAndKey.enum = ['new enum1', 'new enum2'];
		const response = await postRequestWithAuth(parameterWithDuplicateCatAndKey, userId, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages.ParameterWithKeyAndCategoryAlreadyExist.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterWithKeyAndCategoryAlreadyExist.message);
	});

	it('Find parameter: returns 200 for find parameter with id', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${findParameterByIdUrl}/${parameter._id}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(200);
	});

	it('Find parameter: returns 404 for find parameter with wrong id/doesnt exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${findParameterByIdUrl}/${parameter._id}`;
		await ParameterModel.deleteOne({ _id: parameter._id });
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(parameterErrorMessages.ParameterNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterNotFound.message);
	});

	it('Find parameter: returns 200 for find parameter with category id', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategoryIdUrl}/${categoryId}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(200);
	});

	it('Find parameter: returns 404 for find parameter with wrong category id/doesnt exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategoryIdUrl}/${parameter._id}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(parameterErrorMessages.ParametersNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParametersNotFound.message);
	});

	it('Find parameter: returns 200 for find parameter with category slug', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategorySlugUrl}/${category.slug}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(200);
	});

	it('Find parameter: returns 404 for find parameter with wrong category slug/doesnt exist', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		await ParameterModel.create(parameterDTO);
		const url = `${findParameterByCategorySlugUrl}/${'wrong-slug'}`;
		const response = await getRequestWithAuth(userId, {}, url);
		expect(response.status).toBe(parameterErrorMessages.ParametersNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParametersNotFound.message);
	});

	it('Find parameter: returns 200 for find all parameters', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameter = await ParameterModel.create(parameterDTO);
		const response = await getRequestWithAuth(userId, {}, baseParameterUrl);
		expect(response.status).toBe(200);
		expect(response.body.parameters.length).toBe(1);
		expect(response.body.parameters[0].title).toBe(parameter.title);
	});

	it('Find parameter: returns 404 for dont find any parameter in fetch all route', async () => {
		const user = await createUser();
		const userId = user._id;
		const response = await getRequestWithAuth(userId, {}, baseParameterUrl);
		expect(response.status).toBe(parameterErrorMessages.ParametersNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParametersNotFound.message);
	});

	it('Delete parameter: returns 200 for delete a parameter', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		const parameter = await ParameterModel.create(parameterDTO);
		const url = `${baseParameterUrl}/${parameter._id}`;
		const response = await deleteRequestWithAuth(userId, url);
		expect(response.status).toBe(parameterSuccessMessages.ParameterDeletedSuccessfully.statusCode);
		expect(response.body.message).toBe(parameterSuccessMessages.ParameterDeletedSuccessfully.message);
	});

	it('Delete parameter: returns 404 for delete a parameter with wrong id', async () => {
		const user = await createUser();
		const userId = user._id;
		const category = await createCategory(correctCategory);
		const categoryId = category._id;
		const parameterDTO = await createParameterData(correctParameterDto, categoryId);
		await ParameterModel.create(parameterDTO);
		const url = `${baseParameterUrl}/${userId}`;
		const response = await deleteRequestWithAuth(userId, url);
		expect(response.status).toBe(parameterErrorMessages.ParameterNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterNotFound.message);
	});

	it('Update parameter: returns 200 for update a parameter with correct vlaues', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const parameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		await ParameterModel.create(parameterDTO);

		const secondCategory = await createCategory(secondCorrectCategory);
		const secondCategoryId = secondCategory._id;
		const secondParameterDto = await createParameterData(secondCorrectParameterDto, secondCategoryId);
		const secondParameter = await ParameterModel.create(secondParameterDto);

		const updateParameterDto = await createParameterData(correctUpdateParameterDto, secondCategoryId);

		const url = `${baseParameterUrl}/${secondParameter._id}`;
		const response = await patchRequestWithAuth(updateParameterDto, userId, url);
		expect(response.status).toBe(200);
		expect(response.body.updatedParameter.key).toBe(updateParameterDto.key);
	});

	it('Update parameter: returns 409 for update a parameter with duplicate key and category vlaues', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const firstParameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		const firstParameter = await ParameterModel.create(firstParameterDTO);

		const secondCategory = await createCategory(secondCorrectCategory);
		const secondCategoryId = secondCategory._id;
		const secondParameterDto = await createParameterData(secondCorrectParameterDto, secondCategoryId);
		const secondParameter = await ParameterModel.create(secondParameterDto);

		const updateParameterDto = await createParameterData(correctUpdateParameterDto, firstCategoryId);
		updateParameterDto.key = firstParameter.key;
		updateParameterDto.category = firstParameter.category;

		const url = `${baseParameterUrl}/${secondParameter._id}`;
		const response = await patchRequestWithAuth(updateParameterDto, userId, url);
		expect(response.status).toBe(parameterErrorMessages.ParameterWithKeyAndCategoryAlreadyExist.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterWithKeyAndCategoryAlreadyExist.message);
	});

	it('Update parameter: returns 400 for update a parameter with wrong id format request', async () => {
		const user = await createUser();
		const userId = user._id;
		const url = `${baseParameterUrl}/1234`;
		const response = await patchRequestWithAuth({}, userId, url);
		expect(response.status).toBe(parameterErrorMessages.WrongParameterId.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.WrongParameterId.message);
	});

	it('Update parameter: returns 404 for update a parameter with wrong parameter id/doesnt exist request', async () => {
		const user = await createUser();
		const userId = user._id;
		const url = `${baseParameterUrl}/${userId}`;
		const response = await patchRequestWithAuth({}, userId, url);
		expect(response.status).toBe(parameterErrorMessages.ParameterNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.ParameterNotFound.message);
	});

	it('Update parameter: returns 404 for update a parameter with wrong category id/doesnt exist request', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const firstParameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		const firstParameter = await ParameterModel.create(firstParameterDTO);
		const url = `${baseParameterUrl}/${firstParameter._id}`;
		const response = await patchRequestWithAuth({ category: userId }, userId, url);
		expect(response.status).toBe(parameterErrorMessages.CategoryNotFound.statusCode);
		expect(response.body.message).toBe(parameterErrorMessages.CategoryNotFound.message);
	});

	it('Update parameter: returns 400 for update a parameter with number type title instead of string', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const firstParameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		const firstParameter = await ParameterModel.create(firstParameterDTO);
		const url = `${baseParameterUrl}/${firstParameter._id}`;
		const response = await patchRequestWithAuth({ title: 2 }, userId, url);
		expect(response.status).toBe(parameterErrorMessages['"title" must be a string'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"title" must be a string'].message);
	});

	it('Update parameter: returns 400 for update a parameter with empty string title', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const firstParameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		const firstParameter = await ParameterModel.create(firstParameterDTO);
		const url = `${baseParameterUrl}/${firstParameter._id}`;
		const response = await patchRequestWithAuth({ title: '' }, userId, url);
		expect(response.status).toBe(parameterErrorMessages['"title" contains an invalid value'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"title" contains an invalid value'].message);
	});

	it('Update parameter: returns 400 for update a parameter with number type key instead of string', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const firstParameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		const firstParameter = await ParameterModel.create(firstParameterDTO);
		const url = `${baseParameterUrl}/${firstParameter._id}`;
		const response = await patchRequestWithAuth({ key: 2 }, userId, url);
		expect(response.status).toBe(parameterErrorMessages['"key" must be a string'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"key" must be a string'].message);
	});

	it('Update parameter: returns 400 for update a parameter with empty string key', async () => {
		const user = await createUser();
		const userId = user._id;
		const firstCategory = await createCategory(correctCategory);
		const firstCategoryId = firstCategory._id;
		const firstParameterDTO = await createParameterData(correctParameterDto, firstCategoryId);
		const firstParameter = await ParameterModel.create(firstParameterDTO);
		const url = `${baseParameterUrl}/${firstParameter._id}`;
		const response = await patchRequestWithAuth({ key: '' }, userId, url);
		expect(response.status).toBe(parameterErrorMessages['"key" contains an invalid value'].statusCode);
		expect(response.body.message).toBe(parameterErrorMessages['"key" contains an invalid value'].message);
	});
});
