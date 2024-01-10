import dotenv from 'dotenv';
import request from 'supertest';
import { sign } from 'cookie-signature';

import app from '../../app.js';
import CookieNames from '../constants/cookies.enum.js';
import tokenGenerator from '../../modules/user/functions/jwtToken/jwtToken.generator.js';
import { Roles } from '../../modules/user/model/user.model.js';
import UserRepository from '../../modules/user/model/user.repository.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const cookieSecretKey = process.env.COOKIE_SECRET_KEY;

const userAdminData = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '09375338875',
	role: Roles.SUPERADMIN,
};

const generateToken = async (payload) => {
	const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
	const tokenOptions = { expiresIn: 300000 };
	const xAuthToken = await tokenGenerator(payload, tokenSecretKey, tokenOptions);
	return xAuthToken;
};

export const createUser = async (userData = userAdminData) => {
	const user = await UserRepository.create(userData);
	return user;
};

export const getRequestWithAuth = async (userId, filterQuery = {}, url) => {
	const xAuthToken = await generateToken({ id: userId });
	const response = await request(app)
		.get(url)
		.query(filterQuery)
		.set('Cookie', `${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

export const postRequestWithAuth = async (data, userId, url) => {
	const xAuthToken = await generateToken({ id: userId });
	const response = await request(app)
		.post(url)
		.send(data)
		.set('Cookie', `${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

// const addUsers = async (userCount) => {
// 	const users = [];
// 	for (let i = 0; i < userCount; i++) {
// 		const user = await UserRepository.create({
// 			firstname: `user${i}`,
// 			lastname: `user${i}`,
// 			mobile: `0931111111${i}`,
// 		});
// 		users.push(user);
// 	}
// 	return users;
// };
