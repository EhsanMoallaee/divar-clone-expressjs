import CookieNames from '../../../../common/constants/cookies.enum.js';
import AppError from '../../../errorHandling/app.error.js';
import authErrorMessages from '../../authModule/messages/auth.errorMessages.js';

export default async function preventRelogin(res) {
	res.clearCookie(CookieNames.AccessCookie);
	res.clearCookie(CookieNames.RefreshCookie);
	throw new AppError(authErrorMessages.PreventRelogin.message, authErrorMessages.PreventRelogin.statusCode);
}
