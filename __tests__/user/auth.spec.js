import request from 'supertest';

import app from '../../src/app.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import authSuccessMessages from '../../src/modules/user/auth/messages/auth.successMessages.js';
import authErrorMessages from '../../src/modules/user/auth/messages/auth.errorMessages.js';
import redisSingletonInstance from '../../src/modules/redisClient/redis.client.js';
import UserModel from '../../src/modules/user/model/user.model.js';

beforeAll(async () => {
	new ConnectMongodb();
});

afterEach(async () => {
	await UserModel.deleteMany({});
	await redisSingletonInstance.flushAll();
});

const correctCredentials = {
	firstname: 'user',
	lastname: 'user',
	mobile: '09375338875',
};
const incorrectCredentials = {
	firstname: 'user',
	lastname: 'user',
	mobile: '123456',
};
const registerationRequestURL = '/api/users/auth/v1/registerationRequest';
const registerURL = '/api/users/auth/v1/register';

describe('Authentication tests', () => {
	it('Registeration request: returns 200 with correct mobile,first and last name values', async () => {
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(200);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully['message']);
	});

	it('Registeration request: returns 400 with incorrect mobile', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectCredentials);
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.WrongMobileNumber['message']);
	});

	it('Registeration request: returns 400 if before otpCode expiration,user sends request again', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.SpamAttack['message']);
	});

	it('Register request: returns 200 with correct otpCode', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(registerURL).send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(201);
		expect(response.body.message).toBe(authSuccessMessages.RegisteredSuccessfully['message']);
	});

	it('Register request: returns 400 with incorrect otpCode', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode + 1;
		const response = await request(app).post(registerURL).send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});

	it('Register request: returns 400 with incorrect mobile', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(registerURL).send({ mobile: incorrectCredentials.mobile, otpCode });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});
});
