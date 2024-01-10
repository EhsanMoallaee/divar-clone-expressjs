import AppError from '../modules/errorHandling/app.error.js';
import authorizationErrorMessages from './messages/authorization.errorMessages.js';
import catchAsyncErrors from '../modules/errorHandling/catch.asyncErrors.js';

function authorizationGuard(requiredRoles = []) {
	return catchAsyncErrors(async (req, res, next) => {
		if (!req.user)
			throw new AppError(
				authorizationErrorMessages.UnAuthorized.message,
				authorizationErrorMessages.UnAuthorized.statusCode
			);
		const userRole = req.user.role;
		const hasRole = requiredRoles.some((role) => {
			return userRole.includes(role);
		});
		if (requiredRoles.length == 0 || hasRole) return next();
		throw new AppError(
			authorizationErrorMessages.UnAuthorized.message,
			authorizationErrorMessages.UnAuthorized.statusCode
		);
	});
}

export default authorizationGuard;
