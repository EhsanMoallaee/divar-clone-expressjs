import config from 'config';

import AuthService from './auth.service.js';
import authSuccessMessages from './messages/auth.successMessages.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import CookieNames from '../../../common/constants/cookies.enum.js';
import preventCSRFAttack from '../functions/preventCsrfAttck/prevent.csrfAttack.js';

class AuthController {
	#AuthService;
	constructor() {
		this.#AuthService = AuthService;
	}

	registerationRequest = catchAsyncErrors(async (req, res) => {
		const userData = req.body;
		const { message, statusCode } = await this.#AuthService.registerationRequest(userData);
		return res.status(statusCode).json({ message });
	});

	register = catchAsyncErrors(async (req, res) => {
		const data = req.body;
		const { message, statusCode, token } = await this.#AuthService.register(data);
		const xAuthCookieOption = config.get('cookieOptions.login');
		res.cookie(CookieNames.XAuthToken, token, xAuthCookieOption);
		return res.status(statusCode).json({ message });
	});

	loginRequest = catchAsyncErrors(async (req, res) => {
		const xAuthCookie = req.signedCookies[CookieNames.XAuthToken];
		if (xAuthCookie) await preventCSRFAttack(xAuthCookie);
		const { mobile } = req.body;
		const { message, statusCode } = await this.#AuthService.loginRequest(mobile);
		return res.status(statusCode).json({ message });
	});

	login = catchAsyncErrors(async (req, res) => {
		const xAuthCookie = req.signedCookies[CookieNames.XAuthToken];
		if (xAuthCookie) await preventCSRFAttack(xAuthCookie);
		const data = req.body;
		const { message, statusCode, token } = await this.#AuthService.login(data);
		const xAuthCookieOption = config.get('cookieOptions.login');
		res.cookie(CookieNames.XAuthToken, token, xAuthCookieOption);
		return res.status(statusCode).json({ message });
	});

	logout = catchAsyncErrors(async (req, res) => {
		return res
			.clearCookie(CookieNames.XAuthToken)
			.status(authSuccessMessages.LoggedOutSuccessfully.statusCode)
			.json({ message: authSuccessMessages.LoggedOutSuccessfully.message });
	});
}

export default new AuthController();
