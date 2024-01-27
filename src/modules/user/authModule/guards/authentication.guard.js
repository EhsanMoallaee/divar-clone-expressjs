import config from 'config';
import dotenv from 'dotenv';

import AppError from '../../../errorHandling/app.error.js';
import authenticationGuardErrorMessages from './messages/authenticationGuard.errorMessages.js';
import AuthService from '../auth.service.js';
import catchAsyncErrors from '../../../errorHandling/catch.asyncErrors.js';
import CookieNames from '../../../../common/constants/cookies.enum.js';
import tokenGenerator from '../../functions/jwtToken/jwtToken.generator.js';
import tokenVerifier from '../../functions/jwtToken/jwtToken.verifier.js';
import UserRepository from '../../model/user.repository.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const authenticationGuard = catchAsyncErrors(async (req, res, next) => {
	const accessTokenInCookie = req.signedCookies[CookieNames.AccessCookie];
	if (!accessTokenInCookie) unAuthenticated(res);

	const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
	const accessTokenVerifyResult = await tokenVerifier(accessTokenInCookie, accessTokenSecretKey);

	if (typeof accessTokenVerifyResult === 'string' && accessTokenVerifyResult === 'jwt expired') {
		const refreshTokenInCookie = req.signedCookies[CookieNames.RefreshCookie];
		if (refreshTokenInCookie) {
			const { browser, os, platform, source } = req.useragent;
			const userAgent = {
				ip: req.ip,
				browser,
				os,
				platform,
				source,
			};
			const { accessToken, refreshToken, user } = await makeNewTokens(res, refreshTokenInCookie, userAgent);
			const accessCookieOptions = config.get('cookieOptions.AccessCookie');
			const refreshCookieOptions = config.get('cookieOptions.RefreshCookie');
			res.cookie(CookieNames.AccessCookie, accessToken, accessCookieOptions);
			res.cookie(CookieNames.RefreshCookie, refreshToken, refreshCookieOptions);
			req.user = user;
			return next();
		}

		unAuthenticated(res);
	}

	if (typeof accessTokenVerifyResult === 'object' && 'id' in accessTokenVerifyResult) {
		const user = await UserRepository.findOneById(accessTokenVerifyResult.id, { __v: 0, updatedAt: 0 });
		if (!user) {
			res.clearCookie(CookieNames.AccessCookie);
			res.clearCookie(CookieNames.RefreshCookie);
			throw new AppError(
				authenticationGuardErrorMessages.UnAuthenticated.message,
				authenticationGuardErrorMessages.UnAuthenticated.statusCode
			);
		}
		req.user = user;
		return next();
	}

	unAuthenticated(res);
});

const makeNewTokens = async (res, refreshTokenInCookie, userAgent) => {
	const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
	const refreshTokenVerifyResult = await tokenVerifier(refreshTokenInCookie, refreshTokenSecretKey);

	if (typeof refreshTokenVerifyResult === 'object' && 'id' in refreshTokenVerifyResult) {
		const aggregate = [
			{
				$unwind: '$refreshTokens',
			},
			{
				$match: {
					'refreshTokens.refreshToken': refreshTokenInCookie,
				},
			},
			{
				$project: {
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				},
			},
		];
		const user = (await UserRepository.aggregate(aggregate))[0];

		if (user._id.equals(refreshTokenVerifyResult.id)) {
			await AuthService.removeUserRefreshTokenByRefreshToken(user._id, refreshTokenInCookie);
			const accessToken = await tokenGenerator(
				{ id: user._id, mobile: user.mobile },
				process.env.ACCESS_TOKEN_SECRET_KEY,
				config.get('accessTokenOptions')
			);
			const refreshToken = await tokenGenerator(
				{ id: user._id },
				process.env.REFRESH_TOKEN_SECRET_KEY,
				config.get('refreshTokenOptions')
			);

			await AuthService.updateUserRefreshTokens(user._id, refreshToken, userAgent);
			return { accessToken, refreshToken, user };
		}
		unAuthenticated(res);
	}
};

const unAuthenticated = (res) => {
	res.clearCookie(CookieNames.AccessCookie);
	res.clearCookie(CookieNames.RefreshCookie);
	throw new AppError(
		authenticationGuardErrorMessages.UnAuthenticated.message,
		authenticationGuardErrorMessages.UnAuthenticated.statusCode
	);
};

export default authenticationGuard;
