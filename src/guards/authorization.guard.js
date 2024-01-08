import dotenv from 'dotenv';
import AppError from '../modules/errorHandling/app.error.js';
import authorizationErrorMessages from './messages/authorization.errorMessages.js';
import catchAsyncErrors from '../modules/errorHandling/catch.asyncErrors.js';
import tokenVerifier from '../modules/user/functions/jwtToken/jwtToken.verifier.js';
import UserRepository from '../modules/user/user.repository.js';
import CookieNames from '../common/constants/cookies.enum.js';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const authorizationGuard = catchAsyncErrors(async (req, res, next) => {
	const xAuthCookie = req.signedCookies[CookieNames.XAuthToken];
	if (!xAuthCookie)
		throw new AppError(
			authorizationErrorMessages.UnAuthorized['message'],
			authorizationErrorMessages.UnAuthorized['statusCode']
		);
	const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
	const decodedData = await tokenVerifier(xAuthCookie, tokenSecretKey);
	if (!decodedData)
		throw new AppError(
			authorizationErrorMessages.UnAuthorized['message'],
			authorizationErrorMessages.UnAuthorized['statusCode']
		);
	if (typeof decodedData === 'object' && 'id' in decodedData) {
		const user = await UserRepository.findOneById(decodedData.id, { __v: 0, updatedAt: 0 });
		if (!user)
			throw new AppError(
				authorizationErrorMessages.UnAuthorized['message'],
				authorizationErrorMessages.UnAuthorized['statusCode']
			);
		req.user = user;
		return next();
	}
	throw new AppError(
		authorizationErrorMessages.UnAuthorized['message'],
		authorizationErrorMessages.UnAuthorized['statusCode']
	);
});

export default authorizationGuard;
