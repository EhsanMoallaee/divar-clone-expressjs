import request from 'supertest';
import app from '../../src/app.js';
import categoryErrorMessages from '../../src/modules/category/messages/category.errorMessages.js';
import categorySuccessMessages from '../../src/modules/category/messages/category.successMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import CategoryModel from '../../src/modules/category/model/category.model.js';

beforeAll(async () => {
	new ConnectMongodb();
	await CategoryModel.deleteMany({});
});

afterEach(async () => {
	await CategoryModel.deleteMany({});
});

const correctCategory = {
	title: 'category-1',
	slug: 'category-1-slug',
	description: 'category-1-description',
};

const categoryWithoutTitle = {
	slug: 'category-1-slug',
	description: 'category-1-description',
};

const categoryWithoutSlug = {
	title: 'category-1',
	description: 'category-1-description',
};

const correctParentCategory = {
	title: 'category-parent',
	slug: 'category-parent-slug',
	description: 'category-parent-description',
};
const createCategoryURL = '/api/category/v1/create';

describe('Create Category tests', () => {
	it('Create category: returns 201 with correct values', async () => {
		const response = await request(app).post(createCategoryURL).send(correctCategory);
		expect(response.status).toBe(categorySuccessMessages.CategoryCreatedSuccessfully.statusCode);
		expect(response.body.title).toBe(correctCategory.title);
		expect(response.body.slug).toBe(correctCategory.slug);
	});

	it('Create sub category: returns 201 with correct values and correct parent id', async () => {
		const parentCategory = await CategoryModel.create(correctParentCategory);
		const parentId = parentCategory._id;
		const subCategory = {
			...correctCategory,
			parentId,
		};
		const response = await request(app).post(createCategoryURL).send(subCategory);
		expect(response.body.title).toBe(correctCategory.title);
		expect(response.body.slug).toBe(correctCategory.slug);
		expect(response.body.parentId).toBe(parentId.toString());
	});

	it('Create category: returns 400 without required field title', async () => {
		const response = await request(app).post(createCategoryURL).send(categoryWithoutTitle);
		expect(response.status).toBe(categoryErrorMessages['"title" is required'].statusCode);
		expect(response.body.message).toBe(categoryErrorMessages['"title" is required'].message);
	});

	it('Create category: returns 400 without required field slug', async () => {
		const response = await request(app).post(createCategoryURL).send(categoryWithoutSlug);
		expect(response.status).toBe(categoryErrorMessages['"slug" is required'].statusCode);
		expect(response.body.message).toBe(categoryErrorMessages['"slug" is required'].message);
	});

	it('Create category: returns 409 with duplicate field title', async () => {
		await request(app).post(createCategoryURL).send(correctCategory);
		correctCategory.slug = 'slug';
		const response = await request(app).post(createCategoryURL).send(correctCategory);
		expect(response.status).toBe(409);
	});

	it('Create category: returns 409 with duplicate field slug', async () => {
		await request(app).post(createCategoryURL).send(correctCategory);
		correctCategory.title = 'title';
		const response = await request(app).post(createCategoryURL).send(correctCategory);
		expect(response.status).toBe(409);
	});

	it('Create category: returns 404 if parent category not found', async () => {
		const parentCategory = await CategoryModel.create(correctParentCategory);
		const parentId = parentCategory._id;
		await CategoryModel.deleteOne({ _id: parentId });
		const subCategory = {
			...correctCategory,
			parentId,
		};
		const response = await request(app).post(createCategoryURL).send(subCategory);
		expect(response.status).toBe(categoryErrorMessages.ParentCategoryDidntFound.statusCode);
		expect(response.body.message).toBe(categoryErrorMessages.ParentCategoryDidntFound.message);
	});
});
