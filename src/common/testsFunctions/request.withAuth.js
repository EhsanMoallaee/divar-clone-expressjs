/* eslint-disable no-useless-escape */
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

export const deleteRequestWithAuth = async (userId, url) => {
	const xAuthToken = await generateToken({ id: userId });
	const response = await request(app)
		.delete(url)
		.set('Cookie', `${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

export const patchRequestWithAuth = async (data, userId, url) => {
	const xAuthToken = await generateToken({ id: userId });
	const response = await request(app)
		.patch(url)
		.send(data)
		.set('Cookie', `${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

export const postRequestWithAuth = async (data, userId, url, image) => {
	const xAuthToken = await generateToken({ id: userId });
	const response = await request(app)
		.post(url)
		.send(data)
		.attach('images', image)
		.set('Cookie', `${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}`);
	return response;
};

export const postRequestWithAuthAndFile = async (data, userId, url, image) => {
	const xAuthToken = await generateToken({ id: userId });
	const requestInString = await makeRequestInString(data, xAuthToken, image);

	const AsyncFunction = async function () {}.constructor;
	const fn = new AsyncFunction('request', 'app', 'url', `return await ${requestInString}`);

	const response = (await fn())(request, app, url, image);
	return response;
};

async function makeRequestInString(data, xAuthToken, image) {
	let str = 'async function sendData(request, app, url) { return await request(app).post(url)';

	for (const key in data) {
		if (typeof data[key] == 'object' && key == 'parameters') {
			for (const itemKey in data[key]) {
				const value = data.parameters[itemKey];
				str += `.field('parameters[${itemKey}]', '${value}', {contentType: 'application/json'})`;
			}
		} else if (Array.isArray(data[key])) {
			str += `.field('coordinate', [${data.coordinate}])`;
		} else {
			str += `.field('${[key]}', '${data[key]}')`;
		}
	}

	str += `.attach('images', '${image}').set('Cookie', '${CookieNames.XAuthToken}=s:${sign(xAuthToken, cookieSecretKey)}')}`;
	return str;
}
