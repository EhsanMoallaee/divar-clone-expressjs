import request from 'supertest';

import app from '../../src/app.js';
import authErrorMessages from '../../src/modules/user/authModule/messages/auth.errorMessages.js';
import { ConnectMongodb } from '../../src/dataAccessLayer/connect.database.js';
import { createUser, getRequestWithAuth } from '../../src/common/testsFunctions/request.withAuth.js';
import profileErrorMessages from '../../src/modules/user/profileModule/messages/profile.errorMessages.js';
import UserModel from '../../src/modules/user/model/user.model.js';

beforeAll(async () => {
	new ConnectMongodb();
});

beforeEach(async () => {
	await UserModel.deleteMany({});
});

afterEach(async () => {
	await UserModel.deleteMany({});
});

const findOneURL = '/api/v1/users/profile/findOne';
const whoAmIURL = '/api/v1/users/profile/whoami';

describe('User profile tests', () => {
	it('return 401 for request without login', async () => {
		const response = await request(app).get(findOneURL);
		expect(response.status).toBe(authErrorMessages.UnAuthenticated.statusCode);
		expect(response.body.message).toBe(authErrorMessages.UnAuthenticated.message);
	});

	it('return 400 for find one user with empty filter queries', async () => {
		const user = await createUser();
		const findOneOption = { mobile: user.mobile };
		const filterQuery = {};
		const response = await getRequestWithAuth(findOneOption, filterQuery, findOneURL);
		expect(response.status).toBe(profileErrorMessages.EmptyFilterQuery.statusCode);
		expect(response.body.message).toBe(profileErrorMessages.EmptyFilterQuery.message);
	});

	it('return 404 for find one user with wrong filter queries', async () => {
		const user = await createUser();
		const findOneOption = { mobile: user.mobile };
		const filterQuery = { firstname: 'wrong firstname' };
		const response = await getRequestWithAuth(findOneOption, filterQuery, findOneURL);
		expect(response.status).toBe(profileErrorMessages.UserNotFound.statusCode);
		expect(response.body.message).toBe(profileErrorMessages.UserNotFound.message);
	});

	it('return 200 for find one user with correct filter queries', async () => {
		const user = await createUser();
		const findOneOption = { mobile: user.mobile };
		const filterQuery = { firstname: user.firstname, mobile: user.mobile };
		const response = await getRequestWithAuth(findOneOption, filterQuery, findOneURL);
		expect(response.status).toBe(200);
		expect(response.body.mobile).toBe(user.mobile);
	});

	it('return 200 for whoami route', async () => {
		const user = await createUser();
		const filterQuery = { mobile: user.mobile };
		const response = await getRequestWithAuth(user._id, filterQuery, whoAmIURL);
		expect(response.body.mobile).toBe(user.mobile);
		expect(response.body.firstname).toBe(user.firstname);
		expect(response.status).toBe(200);
	});
});
