import AppError from '../../../errorHandling/app.error.js';
import catchAsyncErrors from '../../../errorHandling/catch.asyncErrors.js';
import authorizationGuardErrorMessages from './messages/authorizationGuard.errorMessages.js';

function authorizationGuard(requiredRoles = []) {
	return catchAsyncErrors(async (req, res, next) => {
		if (!req.user)
			throw new AppError(
				authorizationGuardErrorMessages.UnAuthorized.message,
				authorizationGuardErrorMessages.UnAuthorized.statusCode
			);
		const userRole = req.user.role;
		const hasRole = requiredRoles.some((role) => {
			return userRole.includes(role);
		});
		if (requiredRoles.length == 0 || hasRole) return next();
		throw new AppError(
			authorizationGuardErrorMessages.UnAuthorized.message,
			authorizationGuardErrorMessages.UnAuthorized.statusCode
		);
	});
}

export default authorizationGuard;
