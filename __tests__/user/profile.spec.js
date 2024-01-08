import dotenv from 'dotenv';
import request from 'supertest';
import { sign } from 'cookie-signature';

import app from '../../src/app.js';
import authErrorMessages from '../../src/modules/user/auth/messages/auth.errorMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import profileErrorMessages from '../../src/modules/user/profile/messages/profile.errorMessages.js';
import tokenGenerator from '../../src/modules/user/functions/jwtToken/jwtToken.generator.js';
import UserRepository from '../../src/modules/user/user.repository.js';
import UserModel from '../../src/modules/user/model/user.model.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

beforeAll(async () => {
	new ConnectMongodb();
});

beforeEach(async () => {
	await UserModel.deleteMany({});
});

const cookieSecretKey = process.env.COOKIE_SECRET_KEY;
const findOneURL = '/api/users/profile/v1/findOne';
const whoAmIURL = '/api/users/profile/v1/whoami';

const addUsers = async (userCount) => {
	const users = [];
	for (let i = 0; i < userCount; i++) {
		const user = await UserRepository.create({
			firstname: `user${i}`,
			lastname: `user${i}`,
			mobile: `0931111111${i}`,
		});
		users.push(user);
	}
	return users;
};

const generateToken = async (payload) => {
	const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
	const tokenOptions = { expiresIn: 300000 };
	const xAuthToken = await tokenGenerator(payload, tokenSecretKey, tokenOptions);
	return xAuthToken;
};

const getUsers = (url) => {
	const agent = request(app).get(url);
	return agent;
};

const requestWithAuth = async (findOneOption = {}, filterQuery = {}, url) => {
	const user = await UserRepository.findOne(findOneOption);
	const xAuthToken = await generateToken({ id: user._id });
	const response = await getUsers(url)
		.query(filterQuery)
		.set('Cookie', `x-auth-token=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

describe('User profile tests', () => {
	it('return 401 for request without logged in credentials', async () => {
		await addUsers(1);
		const response = await getUsers(findOneURL);
		expect(response.status).toBe(authErrorMessages.UnAuthenticated['statusCode']);
		expect(response.body.message).toBe(authErrorMessages.UnAuthenticated['message']);
	});

	it('return 400 for find one user with empty filter queries', async () => {
		const users = await addUsers(1);
		const findOneOption = { mobile: users[0].mobile };
		const filterQuery = {};
		const response = await requestWithAuth(findOneOption, filterQuery, findOneURL);
		expect(response.status).toBe(profileErrorMessages.EmptyFilterQuery['statusCode']);
		expect(response.body.message).toBe(profileErrorMessages.EmptyFilterQuery['message']);
	});

	it('return 404 for find one user with wrong filter queries', async () => {
		const users = await addUsers(1);
		const findOneOption = { mobile: users[0].mobile };
		const filterQuery = { firstname: 'wrong firstname' };
		const response = await requestWithAuth(findOneOption, filterQuery, findOneURL);
		expect(response.status).toBe(profileErrorMessages.UserNotFound['statusCode']);
		expect(response.body.message).toBe(profileErrorMessages.UserNotFound['message']);
	});

	it('return 200 for find one user with correct filter queries', async () => {
		const users = await addUsers(1);
		const findOneOption = { mobile: users[0].mobile };
		const filterQuery = { firstname: users[0].firstname, mobile: users[0].mobile };
		const response = await requestWithAuth(findOneOption, filterQuery, findOneURL);
		expect(response.status).toBe(200);
		expect(response.body.mobile).toBe(users[0].mobile);
	});

	it('return 200 for whoami route', async () => {
		const users = await addUsers(1);
		const findOneOption = { mobile: users[0].mobile };
		const response = await requestWithAuth(findOneOption, {}, whoAmIURL);
		expect(response.body.mobile).toBe(users[0].mobile);
		expect(response.body.firstname).toBe(users[0].firstname);
		expect(response.status).toBe(200);
	});
});
