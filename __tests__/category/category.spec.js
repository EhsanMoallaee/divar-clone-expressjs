import categoryErrorMessages from '../../src/modules/category/messages/category.errorMessages.js';
import CategoryModel from '../../src/modules/category/model/category.model.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import { ConnectMongodb, disconnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import { createUser, postRequestWithAuth } from '../../src/common/testsFunctions/request.withAuth.js';

beforeAll(async () => {
	new ConnectMongodb();
});

beforeEach(async () => {
	await CategoryModel.deleteMany({});
	await UserModel.deleteMany({});
});

afterEach(async () => {
	await CategoryModel.deleteMany({});
	await UserModel.deleteMany({});
});

afterAll(async () => {
	await disconnectMongodb();
});

const correctCategoryDtoDto = {
	title: 'category-1',
	slug: 'category-1-slug',
	description: 'category-1-description',
};

const correctParentCategoryDto = {
	title: 'category-parent',
	slug: 'category-parent-slug',
	description: 'category-parent-description',
};

const baseCategoryURL = '/api/v1/category';

describe('Create Category tests', () => {
	it('Create category: returns 201 with correct values', async () => {
		const user = await createUser();
		const response = await postRequestWithAuth(correctCategoryDtoDto, user._id, baseCategoryURL);
		expect(response.status).toBe(201);
		expect(response.body.title).toBe(correctCategoryDtoDto.title);
		expect(response.body.slug).toBe(correctCategoryDtoDto.slug);
	});

	it('Create sub category: returns 201 with correct values and correct parent id', async () => {
		const user = await createUser();
		const parentCategory = await CategoryModel.create(correctParentCategoryDto);
		const parentId = parentCategory._id;
		const subCategory = {
			...correctCategoryDtoDto,
			parentId,
		};
		const response = await postRequestWithAuth(subCategory, user._id, baseCategoryURL);
		expect(response.body.title).toBe(correctCategoryDtoDto.title);
		expect(response.body.slug).toBe(correctCategoryDtoDto.slug);
		expect(response.body.parentId).toBe(parentId.toString());
	});

	it('Create sub category: check hasChildren field change to true when create a child for it', async () => {
		const user = await createUser();
		let parentCategory = await CategoryModel.create(correctParentCategoryDto);
		const parentId = parentCategory._id;
		const subCategory = {
			...correctCategoryDtoDto,
			parentId,
		};
		const response = await postRequestWithAuth(subCategory, user._id, baseCategoryURL);
		parentCategory = await CategoryModel.findById(parentCategory._id);
		expect(response.body.title).toBe(correctCategoryDtoDto.title);
		expect(response.body.parentId).toBe(parentId.toString());
		expect(parentCategory.hasChildren).toBe(true);
	});

	it('Create category: returns 400 without required field title', async () => {
		const user = await createUser();
		const categoryWithoutTitle = JSON.parse(JSON.stringify(correctCategoryDtoDto));
		delete categoryWithoutTitle.title;
		const response = await postRequestWithAuth(categoryWithoutTitle, user._id, baseCategoryURL);
		expect(response.status).toBe(categoryErrorMessages['"title" is required'].statusCode);
		expect(response.body.message).toBe(categoryErrorMessages['"title" is required'].message);
	});

	it('Create category: returns 400 without required field slug', async () => {
		const user = await createUser();
		const categoryWithoutSlug = JSON.parse(JSON.stringify(correctCategoryDtoDto));
		delete categoryWithoutSlug.slug;
		const response = await postRequestWithAuth(categoryWithoutSlug, user._id, baseCategoryURL);
		expect(response.status).toBe(categoryErrorMessages['"slug" is required'].statusCode);
		expect(response.body.message).toBe(categoryErrorMessages['"slug" is required'].message);
	});

	it('Create category: returns 409 with duplicate field title', async () => {
		const user = await createUser();
		await CategoryModel.create(correctCategoryDtoDto);
		const categoryWithDuplicateTitle = JSON.parse(JSON.stringify(correctCategoryDtoDto));
		categoryWithDuplicateTitle.slug = 'new slug';
		const response = await postRequestWithAuth(categoryWithDuplicateTitle, user._id, baseCategoryURL);
		expect(response.status).toBe(409);
	});

	it('Create category: returns 409 with duplicate field slug', async () => {
		const user = await createUser();
		await CategoryModel.create(correctCategoryDtoDto);
		const categoryWithDuplicateSlug = JSON.parse(JSON.stringify(correctCategoryDtoDto));
		categoryWithDuplicateSlug.title = 'new title';
		const response = await postRequestWithAuth(categoryWithDuplicateSlug, user._id, baseCategoryURL);
		expect(response.status).toBe(409);
	});

	it('Create category: returns 404 if parent category not found', async () => {
		const parentCategory = await CategoryModel.create(correctParentCategoryDto);
		const parentId = parentCategory._id;
		await CategoryModel.deleteOne({ _id: parentId });
		const subCategory = {
			...correctCategoryDtoDto,
			parentId,
		};
		const user = await createUser();
		const response = await postRequestWithAuth(subCategory, user._id, baseCategoryURL);
		expect(response.status).toBe(categoryErrorMessages.ParentCategoryNotFound.statusCode);
		expect(response.body.message).toBe(categoryErrorMessages.ParentCategoryNotFound.message);
	});
});
