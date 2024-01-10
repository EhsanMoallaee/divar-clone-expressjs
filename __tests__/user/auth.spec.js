import request from 'supertest';

import app from '../../src/app.js';
import authErrorMessages from '../../src/modules/user/authModule/messages/auth.errorMessages.js';
import authSuccessMessages from '../../src/modules/user/authModule/messages/auth.successMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import redisSingletonInstance from '../../src/modules/redisClient/redis.client.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import { createUser, getRequestWithAuth } from '../../src/common/testsFunctions/request.withAuth.js';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
beforeAll(async () => {
	new ConnectMongodb();
	await UserModel.deleteMany({});
	await redisSingletonInstance.flushAll();
});

beforeEach(async () => {
	await UserModel.deleteMany({});
	await redisSingletonInstance.flushAll();
});

afterEach(async () => {
	await UserModel.deleteMany({});
	await redisSingletonInstance.flushAll();
});

const correctCredentials = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '09375338875',
};

const incorrectCredentials = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '123456',
};

const registerationRequestURL = '/api/v1/users/auth/registerationRequest';
const registerURL = '/api/v1/users/auth/register';
const loginRequestURL = '/api/v1/users/auth/loginRequest';
const loginURL = '/api/v1/users/auth/login';
const logoutURL = '/api/v1/users/auth/logout';

describe('Authentication Register tests', () => {
	it('Registeration request: returns 200 with correct mobile,first and last name values', async () => {
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(authSuccessMessages.OTPSentSuccessfully.statusCode);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully.message);
	});

	it('Registeration request: returns 400 with incorrect mobile', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectCredentials);
		expect(response.status).toBe(authErrorMessages.WrongMobileNumber.statusCode);
		expect(response.body.message).toBe(authErrorMessages.WrongMobileNumber.message);
	});

	it('Registeration request: returns 400 if before otpCode expiration,user sends request again', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(authErrorMessages.SpamAttack.statusCode);
		expect(response.body.message).toBe(authErrorMessages.SpamAttack.message);
	});

	it('Register: returns 200 with correct otpCode', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(registerURL).send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(authSuccessMessages.RegisteredSuccessfully.statusCode);
		expect(response.body.message).toBe(authSuccessMessages.RegisteredSuccessfully.message);
	});

	it('Register: returns 400 with incorrect otpCode', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode + 1;
		const response = await request(app).post(registerURL).send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(authErrorMessages.WrongOtpCode.statusCode);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode.message);
	});

	it('Register request: returns 400 with incorrect mobile', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(registerURL).send({ mobile: incorrectCredentials.mobile, otpCode });
		expect(response.status).toBe(authErrorMessages.WrongOtpCode.statusCode);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode.message);
	});
});

describe('Authentication Login tests', () => {
	it('Login request: returns 200 with correct mobile number', async () => {
		await createUser(correctCredentials);
		const response = await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		expect(response.status).toBe(authSuccessMessages.OTPSentSuccessfully.statusCode);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully.message);
	});

	it('Login request: returns 400 if user doesnt exist', async () => {
		const response = await request(app).post(loginRequestURL).send(incorrectCredentials.mobile);
		expect(response.status).toBe(authErrorMessages.RegisterFirst.statusCode);
		expect(response.body.message).toBe(authErrorMessages.RegisterFirst.message);
	});

	it('Login request: returns 400 if user send login request again before otp code expire', async () => {
		await createUser(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const response = await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		expect(response.status).toBe(authErrorMessages.SpamAttack.statusCode);
		expect(response.body.message).toBe(authErrorMessages.SpamAttack.message);
	});

	it('Login (Confirm): returns 200 with correct otp code', async () => {
		const user = await createUser(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const data = await redisSingletonInstance.getData(user.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(loginURL).send({ mobile: user.mobile, otpCode });
		expect(response.status).toBe(authSuccessMessages.LoggedInSuccessfully.statusCode);
		expect(response.body.message).toBe(authSuccessMessages.LoggedInSuccessfully.message);
	});

	it('Login (Confirm): returns 400 with incorrect otp code', async () => {
		const user = await createUser(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const data = await redisSingletonInstance.getData(user.mobile);
		const otpCode = JSON.parse(data).otpCode + 1;
		const response = await request(app).post(loginURL).send({ mobile: user.mobile, otpCode });
		expect(response.status).toBe(authErrorMessages.WrongOtpCode.statusCode);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode.message);
	});
});

describe('Authentication Logout tests', () => {
	it('Logout: returns 200 when user was logged in', async () => {
		const user = await createUser(correctCredentials);
		const response = await getRequestWithAuth(user._id, {}, logoutURL);
		expect(response.status).toBe(authSuccessMessages.LoggedOutSuccessfully.statusCode);
		expect(response.body.message).toBe(authSuccessMessages.LoggedOutSuccessfully.message);
	});

	it('Logout: returns 401 when user was not logged in', async () => {
		const response = await request(app).get(logoutURL);
		expect(response.status).toBe(authErrorMessages.UnAuthenticated.statusCode);
		expect(response.body.message).toBe(authErrorMessages.UnAuthenticated.message);
	});
});
