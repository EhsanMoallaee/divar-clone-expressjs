import config from 'config';
import request from 'supertest';
import { sign } from 'cookie-signature';

import app from '../../src/app.js';
import profileErrorMessages from '../../src/modules/user/profile/errorMessages/profile.errorMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import userRepository from '../../src/modules/user/user.repository.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import tokenGenerator from '../../src/common/jwtToken/jwtToken.generator.js';

beforeAll(async () => {
	new ConnectMongodb();
});

afterEach(async () => {
	await UserModel.deleteMany({});
});

const cookieSecretKey = process.env.COOKIE_SECRET_KEY;

const addUsers = async (userCount) => {
	for (let i = 0; i < userCount; i++) {
		await userRepository.create({
			firstname: `user${i}`,
			lastname: `user${i}`,
			mobile: `0937533111${i}`,
		});
	}
};

const generateToken = async (payload) => {
	const tokenSecretKey = config.get('secrets.login.tokenSecretKey');
	const tokenOptions = config.get('secrets.login.tokenOption');
	const xAuthToken = await tokenGenerator(payload, tokenSecretKey, tokenOptions);
	return xAuthToken;
};

const getUsers = () => {
	const agent = request(app).get('/api/users/profile/v1/findOne');
	return agent;
};

const requestWithAuth = async (findOneOption = {}, query = {}) => {
	const user = await userRepository.findOne(findOneOption);
	const xAuthToken = await generateToken({ id: user._id });
	const response = await getUsers()
		.query(query)
		.set('Cookie', `x-auth-token=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

describe('User profile tests', () => {
	it('return 400 for find one user with empty filter queries', async () => {
		await addUsers(1);
		const findOneOption = { mobile: '09375331110' };
		const query = {};
		const response = await requestWithAuth(findOneOption, query);
		expect(response.status).toBe(profileErrorMessages.EmptyFilterQuery['statusCode']);
		expect(response.body.message).toBe(profileErrorMessages.EmptyFilterQuery['message']);
	});

	it('return 404 for find one user with wrong filter queries', async () => {
		await addUsers(1);
		const findOneOption = { mobile: '09375331110' };
		const query = { firstname: 'wrong firstname' };
		const response = await requestWithAuth(findOneOption, query);
		expect(response.status).toBe(profileErrorMessages.UserNotFound['statusCode']);
		expect(response.body.message).toBe(profileErrorMessages.UserNotFound['message']);
	});

	it('return 200 for find one user with correct filter queries', async () => {
		await addUsers(1);
		const findOneOption = { mobile: '09375331110' };
		const query = { firstname: 'user0', mobile: '09375331110' };
		const response = await requestWithAuth(findOneOption, query);
		expect(response.status).toBe(200);
	});
});
