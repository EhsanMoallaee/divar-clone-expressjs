import request from 'supertest';

import app from '../../src/app.js';
import authErrorMessages from '../../src/modules/user/authModule/messages/auth.errorMessages.js';
import profileErrorMessages from '../../src/modules/user/profileModule/messages/profile.errorMessages.js';
import UserModel from '../../src/modules/user/model/user.model.js';
import { ConnectMongodb, disconnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import { createUser, getRequestWithAuth } from '../../src/common/testsFunctions/request.withAuth.js';

beforeAll(async () => {
	new ConnectMongodb();
});

beforeEach(async () => {
	await UserModel.deleteMany({});
});

afterEach(async () => {
	await UserModel.deleteMany({});
});

afterAll(async () => {
	await disconnectMongodb();
});

const findOneURL = '/api/v1/users/profile/findOne';
const whoAmIURL = '/api/v1/users/profile/whoami';

describe('User profile tests', () => {
	it('Profile: return 200 for whoami route', async () => {
		const user = await createUser();
		const filterQuery = { mobile: user.mobile };
		const response = await getRequestWithAuth(user._id, filterQuery, whoAmIURL);
		expect(response.body.mobile).toBe(user.mobile);
		expect(response.body.firstname).toBe(user.firstname);
		expect(response.status).toBe(200);
	});

	it('Profile: return 200 for find one user with correct filter queries', async () => {
		const user = await createUser();
		const filterQuery = { firstname: user.firstname, mobile: user.mobile };
		const response = await getRequestWithAuth(user._id, filterQuery, findOneURL);
		expect(response.status).toBe(200);
		expect(response.body.mobile).toBe(user.mobile);
	});

	it('Profile: return 401 for find one user request without login', async () => {
		const response = await request(app).get(findOneURL);
		expect(response.status).toBe(authErrorMessages.UnAuthenticated.statusCode);
		expect(response.body.message).toBe(authErrorMessages.UnAuthenticated.message);
	});

	it('Profile: return 400 for find one user with empty filter queries', async () => {
		const user = await createUser();
		const filterQuery = {};
		const response = await getRequestWithAuth(user._id, filterQuery, findOneURL);
		expect(response.status).toBe(profileErrorMessages.EmptyFilterQuery.statusCode);
		expect(response.body.message).toBe(profileErrorMessages.EmptyFilterQuery.message);
	});

	it('Profile: return 404 for find one user with wrong filter queries', async () => {
		const user = await createUser();
		const filterQuery = { firstname: 'wrong firstname' };
		const response = await getRequestWithAuth(user._id, filterQuery, findOneURL);
		expect(response.status).toBe(profileErrorMessages.UserNotFound.statusCode);
		expect(response.body.message).toBe(profileErrorMessages.UserNotFound.message);
	});
});
