import dotenv from 'dotenv';
import request from 'supertest';

import app from '../../src/app.js';
import profileErrorMessages from '../../src/modules/user/profile/errorMessages/profile.errorMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import userRepository from '../../src/modules/user/user.repository.js';
import UserModel from '../../src/modules/user/model/user.model.js';
dotenv.config();

beforeAll(async () => {
	new ConnectMongodb();
});

afterEach(async () => {
	await UserModel.deleteMany({});
});

const addUsers = async (userCount) => {
	for (let i = 0; i < userCount; i++) {
		await userRepository.create({
			firstname: `user${i + 1}`,
			lastname: `user${i + 1}`,
			mobile: `1${i}`,
		});
	}
};

const getUsers = () => {
	const agent = request(app).get('/api/users/profile/v1/findOne');
	return agent;
};

describe('User profile tests', () => {
	it('return 400 for find one user with empty filter queries', async () => {
		const response = await getUsers().query({});
		expect(response.status).toBe(profileErrorMessages.EmptyFilterQuery['statusCode']);
		expect(response.body.message).toBe(profileErrorMessages.EmptyFilterQuery['message']);
	});

	it('return 404 for find one user with wrong filter queries', async () => {
		await addUsers(1);
		const response = await getUsers().query({ firstname: 'wrong firstname' });
		expect(response.status).toBe(profileErrorMessages.NotFound['statusCode']);
		expect(response.body.message).toBe(profileErrorMessages.NotFound['message']);
	});

	it('return 200 for find one user with correct filter queries', async () => {
		await addUsers(1);
		const response = await getUsers().query({ firstname: 'user1', mobile: '10' });
		expect(response.status).toBe(200);
	});
});
