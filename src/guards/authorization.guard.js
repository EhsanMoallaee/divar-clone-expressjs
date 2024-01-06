import config from 'config';
import AppError from '../modules/errorHandling/app.error.js';
import authorizationErrorMessages from './errorMessages/authorization.errorMessages.js';
import catchAsyncErrors from '../modules/errorHandling/catch.asyncErrors.js';
import tokenVerifier from '../common/jwtToken/jwtToken.verifier.js';
import userRepository from '../modules/user/user.repository.js';

const authorizationGuard = catchAsyncErrors(async (req, res, next) => {
	const xAuthCookie = req.signedCookies['x-auth-token'];
	if (!xAuthCookie)
		throw new AppError(
			authorizationErrorMessages.UnAuthorized['message'],
			authorizationErrorMessages.UnAuthorized['statusCode']
		);
	const tokenSecretKey = config.get('secrets.login.tokenSecretKey');
	const decodedData = await tokenVerifier(xAuthCookie, tokenSecretKey);
	if (!decodedData)
		throw new AppError(
			authorizationErrorMessages.UnAuthorized['message'],
			authorizationErrorMessages.UnAuthorized['statusCode']
		);
	const user = await userRepository.findOneById(decodedData.id, { __v: 0, verifiedMobile: 0 });
	if (!user)
		throw new AppError(
			authorizationErrorMessages.UnAuthorized['message'],
			authorizationErrorMessages.UnAuthorized['statusCode']
		);
	req.user = user;
	next();
});

export default authorizationGuard;
