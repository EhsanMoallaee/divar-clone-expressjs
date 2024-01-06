import config from 'config';
import request from 'supertest';

import app from '../../src/app.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import authSuccessMessages from '../../src/modules/user/auth/messages/auth.successMessages.js';
import authErrorMessages from '../../src/modules/user/auth/messages/auth.errorMessages.js';
import redisSingletonInstance from '../../src/modules/redisClient/redis.client.js';

// import dotenv from 'dotenv';
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

beforeAll(async () => {
	new ConnectMongodb();
});

afterEach(async () => {
	await UserModel.deleteMany({});
	await redisSingletonInstance.flushAll();
});

const correctCredentials = config.get('userCorrectCredentials');
const incorrectCredentials = config.get('userIncorrectCredentials');

describe('Authentication tests', () => {
	it('Registeration request: returns 200 with correct mobile,first and last name values', async () => {
		const response = await request(app).post('/api/users/auth/v1/registerationRequest').send(correctCredentials);
		expect(response.status).toBe(200);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully['message']);
	});

	it('Registeration request: returns 400 with incorrect mobile', async () => {
		const response = await request(app).post('/api/users/auth/v1/registerationRequest').send(incorrectCredentials);
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.WrongMobileNumber['message']);
	});

	it('Registeration request: returns 400 if before otpCode expire send request again', async () => {
		await request(app).post('/api/users/auth/v1/registerationRequest').send(correctCredentials);
		const response = await request(app).post('/api/users/auth/v1/registerationRequest').send(correctCredentials);
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.SpamAttack['message']);
	});

	it('Register request: returns 200 with correct otpCode', async () => {
		await request(app).post('/api/users/auth/v1/registerationRequest').send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app)
			.post('/api/users/auth/v1/register')
			.send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(201);
		expect(response.body.message).toBe(authSuccessMessages.RegisteredSuccessfully['message']);
	});

	it('Register request: returns 400 with incorrect otpCode', async () => {
		await request(app).post('/api/users/auth/v1/registerationRequest').send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode + 1;
		const response = await request(app)
			.post('/api/users/auth/v1/register')
			.send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});

	it('Register request: returns 400 with incorrect mobile', async () => {
		await request(app).post('/api/users/auth/v1/registerationRequest').send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app)
			.post('/api/users/auth/v1/register')
			.send({ mobile: incorrectCredentials.mobile, otpCode });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});
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
