import dotenv from 'dotenv';
import request from 'supertest';

import app from '../../src/app.js';
import authErrorMessages from '../../src/modules/user/auth/messages/auth.errorMessages.js';
import authSuccessMessages from '../../src/modules/user/auth/messages/auth.successMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import CookieNames from '../../src/common/constants/cookies.enum.js';
import redisSingletonInstance from '../../src/modules/redisClient/redis.client.js';
import { sign } from 'cookie-signature';
import tokenGenerator from '../../src/modules/user/functions/jwtToken/jwtToken.generator.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import UserRepository from '../../src/modules/user/user.repository.js';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

beforeAll(async () => {
	new ConnectMongodb();
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

const cookieSecretKey = process.env.COOKIE_SECRET_KEY;
const registerationRequestURL = '/api/users/auth/v1/registerationRequest';
const registerURL = '/api/users/auth/v1/register';
const loginRequestURL = '/api/users/auth/v1/loginRequest';
const loginURL = '/api/users/auth/v1/login';
const logoutURL = '/api/users/auth/v1/logout';

const generateToken = async (payload) => {
	const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
	const tokenOptions = { expiresIn: 300000 };
	const xAuthToken = await tokenGenerator(payload, tokenSecretKey, tokenOptions);
	return xAuthToken;
};

describe('Authentication Register tests', () => {
	it('Registeration request: returns 200 with correct mobile,first and last name values', async () => {
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(authSuccessMessages.OTPSentSuccessfully['statusCode']);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully['message']);
	});

	it('Registeration request: returns 400 with incorrect mobile', async () => {
		const response = await request(app).post(registerationRequestURL).send(incorrectCredentials);
		expect(response.status).toBe(authErrorMessages.WrongMobileNumber['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.WrongMobileNumber['message']);
	});

	it('Registeration request: returns 400 if before otpCode expiration,user sends request again', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const response = await request(app).post(registerationRequestURL).send(correctCredentials);
		expect(response.status).toBe(authErrorMessages.SpamAttack['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.SpamAttack['message']);
	});

	it('Register: returns 200 with correct otpCode', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(registerURL).send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(authSuccessMessages.RegisteredSuccessfully['statusCode']);
		expect(response.body.message).toBe(authSuccessMessages.RegisteredSuccessfully['message']);
	});

	it('Register: returns 400 with incorrect otpCode', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode + 1;
		const response = await request(app).post(registerURL).send({ mobile: correctCredentials.mobile, otpCode });
		expect(response.status).toBe(authErrorMessages.WrongOtpCode['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});

	it('Register request: returns 400 with incorrect mobile', async () => {
		await request(app).post(registerationRequestURL).send(correctCredentials);
		const data = await redisSingletonInstance.getData(correctCredentials.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(registerURL).send({ mobile: incorrectCredentials.mobile, otpCode });
		expect(response.status).toBe(authErrorMessages.WrongOtpCode['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});
});

describe('Authentication Login tests', () => {
	it('Login request: returns 200 with correct mobile number', async () => {
		await UserRepository.create(correctCredentials);
		const response = await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		expect(response.status).toBe(authSuccessMessages.OTPSentSuccessfully['statusCode']);
		expect(response.body.message).toBe(authSuccessMessages.OTPSentSuccessfully['message']);
	});

	it('Login request: returns 400 if user doesnt exist', async () => {
		const response = await request(app).post(loginRequestURL).send(incorrectCredentials.mobile);
		expect(response.status).toBe(authErrorMessages.RegisterFirst['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.RegisterFirst['message']);
	});

	it('Login request: returns 400 if user send login request again before otp code expire', async () => {
		await UserRepository.create(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const response = await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		expect(response.status).toBe(authErrorMessages.SpamAttack['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.SpamAttack['message']);
	});

	it('Login (Confirm): returns 200 with correct otp code', async () => {
		const user = await UserRepository.create(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const data = await redisSingletonInstance.getData(user.mobile);
		const otpCode = JSON.parse(data).otpCode;
		const response = await request(app).post(loginURL).send({ mobile: user.mobile, otpCode });
		expect(response.status).toBe(authSuccessMessages.LoggedInSuccessfully['statusCode']);
		expect(response.body.message).toBe(authSuccessMessages.LoggedInSuccessfully['message']);
	});

	it('Login (Confirm): returns 400 with incorrect otp code', async () => {
		const user = await UserRepository.create(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const data = await redisSingletonInstance.getData(user.mobile);
		const otpCode = JSON.parse(data).otpCode + 1;
		const response = await request(app).post(loginURL).send({ mobile: user.mobile, otpCode });
		expect(response.status).toBe(authErrorMessages.WrongOtpCode['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.WrongOtpCode['message']);
	});
});

describe('Authentication Logout tests', () => {
	it('Logout: returns 200 when user was logged in', async () => {
		const user = await UserRepository.create(correctCredentials);
		await request(app).post(loginRequestURL).send({ mobile: correctCredentials.mobile });
		const data = await redisSingletonInstance.getData(user.mobile);
		const otpCode = JSON.parse(data).otpCode;
		await request(app).post(loginURL).send({ mobile: user.mobile, otpCode });

		const xAuthToken = await generateToken({ id: user._id });
		const response = await request(app)
			.get(logoutURL)
			.set('Cookie', `${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}`);
		expect(response.status).toBe(authSuccessMessages.LoggedOutSuccessfully['statusCode']);
		expect(response.body.message).toBe(authSuccessMessages.LoggedOutSuccessfully['message']);
	});

	it('Logout: returns 401 when user was not logged in', async () => {
		const response = await request(app).get(logoutURL);
		expect(response.status).toBe(authErrorMessages.UnAuthenticated['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.UnAuthenticated['message']);
	});
});
