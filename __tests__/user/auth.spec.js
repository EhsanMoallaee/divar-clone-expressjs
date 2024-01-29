import dotenv from 'dotenv';
import request from 'supertest';

import app from '../../src/app.js';
import authErrorMessages from '../../src/modules/user/authModule/messages/auth.errorMessages.js';
import authSuccessMessages from '../../src/modules/user/authModule/messages/auth.successMessages.js';
import redisSingletonInstance from '../../src/modules/redisClient/redis.client.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import { ConnectMongodb, disconnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import { createUser, getRequestWithAuth } from '../../src/common/testsFunctions/request.withAuth.js';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

beforeAll(async () => {
	new ConnectMongodb();
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

afterAll(async () => {
	await disconnectMongodb();
});

const correctCredentials = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '09375338875',
};

const incorrectCredentials = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '09111111111',
};

const incorrectShortLengthMobile = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '09111',
};

const incorrectLongLengthMobile = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '091111111111111',
};

const incorrectShortLengthFirstname = {
	firstname: 'aa',
	lastname: 'lastname',
	mobile: '091111111111111',
};

const incorrectLongLengthFirstname = {
	firstname: 'aaaaaaaaaaaaaaaaaaaaaa',
	lastname: 'lastname',
	mobile: '091111111111111',
};

const registerationRequestURL = '/api/v1/users/auth/registeration-request';
const registerURL = '/api/v1/users/auth/register';
const loginRequestURL = '/api/v1/users/auth/login-request';
const loginURL = '/api/v1/users/auth/login';
const logoutURL = '/api/v1/users/auth/logout';

describe('Authentication Register tests', () => {
	it('Registeration request: returns 200 with correct mobile,first and last name values', async () => {
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(authSuccessMessages.OTPSentSuccessfully.statusCode);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully.message);
	});

	it('Registeration request: returns 400 with incorrect short firstname(less than 3 characters)', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectShortLengthFirstname);
		expect(response.status).toBe(
			authErrorMessages['"firstname" length must be at least 3 characters long'].statusCode
		);
		expect(response.body.message).toBe(
			authErrorMessages['"firstname" length must be at least 3 characters long'].message
		);
	});

	it('Registeration request: returns 400 with incorrect long firstname(more than 20 characters)', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectLongLengthFirstname);
		expect(response.status).toBe(
			authErrorMessages['"firstname" length must be less than or equal to 20 characters long'].statusCode
		);
		expect(response.body.message).toBe(
			authErrorMessages['"firstname" length must be less than or equal to 20 characters long'].message
		);
	});

	it('Registeration request: returns 400 with incorrect short length mobile', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectShortLengthMobile);
		expect(response.status).toBe(authErrorMessages['"mobile" length must be 11 characters long'].statusCode);
		expect(response.body.message).toBe(authErrorMessages['"mobile" length must be 11 characters long'].message);
	});

	it('Registeration request: returns 400 with incorrect long length mobile', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectLongLengthMobile);
		expect(response.status).toBe(authErrorMessages['"mobile" length must be 11 characters long'].statusCode);
		expect(response.body.message).toBe(authErrorMessages['"mobile" length must be 11 characters long'].message);
	});

	it('Registeration request: returns 400 if user sends request again before the otpCode is expired', async () => {
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
		const response = await request(app).post(loginRequestURL).send({ mobile: incorrectCredentials.mobile });
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

	it('Login (Confirm): returns 400 for request without mobile', async () => {
		const user = await createUser(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const data = await redisSingletonInstance.getData(user.mobile);
		const otpCode = JSON.parse(data).otpCode;

		const response = await request(app).post(loginURL).send({ otpCode });
		expect(response.status).toBe(authErrorMessages['"mobile" is required'].statusCode);
		expect(response.body.message).toBe(authErrorMessages['"mobile" is required'].message);
	});

	it('Login (Confirm): returns 400 for request without otp code', async () => {
		const user = await createUser(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });

		const response = await request(app).post(loginURL).send({ mobile: user.mobile });
		expect(response.status).toBe(authErrorMessages['"otpCode" is required'].statusCode);
		expect(response.body.message).toBe(authErrorMessages['"otpCode" is required'].message);
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
