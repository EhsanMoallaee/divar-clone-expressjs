import dotenv from 'dotenv';
import request from 'supertest';
import { sign } from 'cookie-signature';

import app from '../../app.js';
import CookieNames from '../constants/cookies.enum.js';
import { Roles } from '../../modules/user/model/user.model.js';
import tokenGenerator from '../../modules/user/functions/jwtToken/jwtToken.generator.js';
import UserRepository from '../../modules/user/model/user.repository.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const cookieSecretKey = process.env.COOKIE_SECRET_KEY;

export const userData = {
	firstname: 'user',
	lastname: 'user',
	mobile: '09375338874',
	role: Roles.USER,
};

export const userAdminData = {
	firstname: 'firstname',
	lastname: 'lastname',
	mobile: '09375338875',
	role: Roles.SUPERADMIN,
};

const generateToken = async (payload) => {
	const tokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
	const tokenOptions = { expiresIn: 300000 };
	const accessToken = await tokenGenerator(payload, tokenSecretKey, tokenOptions);
	return accessToken;
};

export const createUser = async (userData = userAdminData) => {
	const user = await UserRepository.create(userData);
	return user;
};

export const getRequestWithAuth = async (userId, filterQuery = {}, url) => {
	const accessToken = await generateToken({ id: userId });
	const response = await request(app)
		.get(url)
		.query(filterQuery)
		.set('Cookie', `${CookieNames.AccessCookie}=s:${sign(accessToken, cookieSecretKey)}`);
	return response;
};

export const getRequestWithoutAuth = async (filterQuery = {}, url) => {
	const response = await request(app).get(url).query(filterQuery);
	return response;
};

export const deleteRequestWithAuth = async (userId, url) => {
	const accessToken = await generateToken({ id: userId });
	const response = await request(app)
		.delete(url)
		.set('Cookie', `${CookieNames.AccessCookie}=s:${sign(accessToken, cookieSecretKey)}`);
	return response;
};

export const deleteRequestWithoutAuth = async (url) => {
	const response = await request(app).delete(url);
	return response;
};

export const patchRequestWithAuth = async (data, userId, url) => {
	const accessToken = await generateToken({ id: userId });
	const response = await request(app)
		.patch(url)
		.send(data)
		.set('Cookie', `${CookieNames.AccessCookie}=s:${sign(accessToken, cookieSecretKey)}`);
	return response;
};

export const patchRequestWithoutAuth = async (data, url) => {
	const response = await request(app).patch(url).send(data);
	return response;
};

export const postRequestWithAuth = async (data, userId, url, image) => {
	const accessToken = await generateToken({ id: userId });
	const response = await request(app)
		.post(url)
		.send(data)
		.attach('images', image)
		.set('Cookie', `${CookieNames.AccessCookie}=s:${sign(accessToken, cookieSecretKey)}`);
	return response;
};

export const postRequestWithoutAuth = async (data, url, image) => {
	const response = await request(app).post(url).send(data).attach('images', image);
	return response;
};

export const postRequestWithAuthAndFile = async (data, userId, url, image) => {
	const accessToken = await generateToken({ id: userId });
	const requestInString = await makeRequestInString(data, accessToken, image);
	const myRequest = Function('return await' + requestInString)();

	const response = await myRequest(request, app, url);
	return response;
};

async function makeRequestInString(data, accessToken, image) {
	let str = 'sendData = async(request, app, url) => { return await request(app).post(url)';

	for (const key in data) {
		if (typeof data[key] == 'object' && key == 'parameters') {
			for (const itemKey in data[key]) {
				const value = data.parameters[itemKey];
				str += `.field('parameters[${itemKey}]', '${value}', {contentType: 'application/json'})`;
			}
		} else if (Array.isArray(data[key])) {
			str += `.field('coordinate', [${data.coordinate[0]}, ${data.coordinate[1]}])`;
		} else {
			str += `.field('${[key]}', '${data[key]}')`;
		}
	}
	str += `.attach('images', '${image}').set('Cookie', '${CookieNames.AccessCookie}=s:${sign(accessToken, cookieSecretKey)}')}`;
	return str;
}
