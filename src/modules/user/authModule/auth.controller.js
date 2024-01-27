import config from 'config';

import AuthService from './auth.service.js';
import authSuccessMessages from './messages/auth.successMessages.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import CookieNames from '../../../common/constants/cookies.enum.js';
import preventRelogin from '../functions/preventRelogin/prevent.relogin.js';

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
		const { browser, os, platform, source } = req.useragent;
		const userAgent = {
			ip: req.ip,
			browser,
			os,
			platform,
			source,
		};
		const { message, statusCode, accessToken, refreshToken } = await this.#AuthService.register(data, userAgent);
		const accessCookieOptions = config.get('cookieOptions.AccessCookie');
		const refreshCookieOptions = config.get('cookieOptions.RefreshCookie');
		res.cookie(CookieNames.AccessCookie, accessToken, accessCookieOptions);
		res.cookie(CookieNames.RefreshCookie, refreshToken, refreshCookieOptions);
		return res.status(statusCode).json({ message });
	});

	loginRequest = catchAsyncErrors(async (req, res) => {
		const accessCookie = req.signedCookies[CookieNames.AccessCookie];
		if (accessCookie) await preventRelogin(res);
		const { mobile } = req.body;
		const { message, statusCode } = await this.#AuthService.loginRequest(mobile);
		return res.status(statusCode).json({ message });
	});

	login = catchAsyncErrors(async (req, res) => {
		const accessCookie = req.signedCookies[CookieNames.AccessCookie];
		if (accessCookie) await preventRelogin(res);
		const data = req.body;
		const { browser, os, platform, source } = req.useragent;
		const userAgent = {
			ip: req.ip,
			browser,
			os,
			platform,
			source,
		};
		const { message, statusCode, accessToken, refreshToken } = await this.#AuthService.login(data, userAgent);
		const accessCookieOptions = config.get('cookieOptions.AccessCookie');
		const refreshCookieOptions = config.get('cookieOptions.RefreshCookie');
		res.clearCookie(CookieNames.AccessCookie);
		res.clearCookie(CookieNames.RefreshCookie);
		res.cookie(CookieNames.AccessCookie, accessToken, accessCookieOptions);
		res.cookie(CookieNames.RefreshCookie, refreshToken, refreshCookieOptions);
		return res.status(statusCode).json({ message });
	});

	logout = catchAsyncErrors(async (req, res) => {
		const refreshToken = req.signedCookies[CookieNames.RefreshCookie];
		const userId = req.user._id;
		await this.#AuthService.removeUserRefreshTokenByRefreshToken(userId, refreshToken);
		return res
			.clearCookie(CookieNames.AccessCookie)
			.clearCookie(CookieNames.RefreshCookie)
			.status(authSuccessMessages.LoggedOutSuccessfully.statusCode)
			.json({ message: authSuccessMessages.LoggedOutSuccessfully.message });
	});
}

export default new AuthController();
