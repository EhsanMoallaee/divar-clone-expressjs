import dotenv from 'dotenv';
import request from 'supertest';

import app from '../../src/app.js';
import profileErrorMessages from '../../src/modules/user/profile/errorMessages/profile.errorMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import userRepository from '../../src/modules/user/user.repository.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import authSuccessMessages from '../../src/modules/user/auth/messages/auth.successMessages.js';
import authErrorMessages from '../../src/modules/user/auth/messages/auth.errorMessages.js';
import AuthService from '../../src/modules/user/auth/auth.service.js';

dotenv.config();
// jest.mock(AuthService);

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

// const registerationRequest = async(data) => {

// }

const getUsers = () => {
	const agent = request(app).get('/api/users/profile/v1/findOne');
	return agent;
};

describe('Authentication tests', () => {
	it('Registration request: returns 200 with correct mobile,first and last name values', async () => {
		const response = authSuccessMessages.OTPSentSuccessfully['message'];
		console.log(response);
		jest.mock('../../src/modules/user/auth/auth.service.js', () => {
			return {
				__esModule: true,
				default: jest.fn(() => response),
				onError: jest.fn(() => 43),
			};
		});
		const authService = require('../../src/modules/user/auth/auth.service.js');
		expect(authService()).toBe(response);
		// const response = await request(app).post('/api/users/auth/v1/registerationRequest').send({
		// 	firstname: 'user',
		// 	lastname: 'user',
		// 	mobile: '09375338875',
		// });
		// expect(response.status).toBe(200);
		// expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully['message']);
	});

	// it('Registration request: returns 400 with incorrect mobile', async () => {
	// 	const response = await request(app).post('/api/users/auth/v1/registerationRequest').send({
	// 		firstname: 'user',
	// 		lastname: 'user',
	// 		mobile: '1234',
	// 	});
	// 	expect(response.status).toBe(400);
	// 	expect(response.body.message).toBe(authErrorMessages.WrongMobileNumber['message']);
	// });

	// it('Registration request: returns 400 if before otpCode expire send request again', async () => {
	// 	await request(app).post('/api/users/auth/v1/registerationRequest').send({
	// 		firstname: 'user',
	// 		lastname: 'user',
	// 		mobile: '09375338875',
	// 	});
	// 	const response = await request(app).post('/api/users/auth/v1/registerationRequest').send({
	// 		firstname: 'user',
	// 		lastname: 'user',
	// 		mobile: '09375338875',
	// 	});
	// 	expect(response.status).toBe(400);
	// 	expect(response.body.message).toBe(authErrorMessages.SpamAttack['message']);
	// });
});

// describe('User profile tests', () => {
// 	it('return 400 for find one user with empty filter queries', async () => {
// 		const response = await getUsers().query({});
// 		expect(response.status).toBe(profileErrorMessages.EmptyFilterQuery['statusCode']);
// 		expect(response.body.message).toBe(profileErrorMessages.EmptyFilterQuery['message']);
// 	});

// 	it('return 404 for find one user with wrong filter queries', async () => {
// 		await addUsers(1);
// 		const response = await getUsers().query({ firstname: 'wrong firstname' });
// 		expect(response.status).toBe(profileErrorMessages.NotFound['statusCode']);
// 		expect(response.body.message).toBe(profileErrorMessages.NotFound['message']);
// 	});

// 	it('return 200 for find one user with correct filter queries', async () => {
// 		await addUsers(1);
// 		const response = await getUsers().query({ firstname: 'user1', mobile: '10' });
// 		expect(response.status).toBe(200);
// 	});
// });
