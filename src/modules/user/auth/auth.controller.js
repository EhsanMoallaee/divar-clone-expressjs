import config from 'config';
import AuthService from './auth.service.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import preventCSRFAttack from '../functions/preventCsrfAttck/prevent.csrfAttack.js';

class AuthController {
	#AuthService;
	constructor() {
		this.#AuthService = AuthService;
	}

	registerationRequest = catchAsyncErrors(async (req, res) => {
		const userData = req.body;
		const result = await this.#AuthService.registerationRequest(userData);
		return res.status(200).json(result);
	});

	register = catchAsyncErrors(async (req, res) => {
		const data = req.body;
		const result = await this.#AuthService.register(data);
		const xAuthCookieOption = config.get('cookieOptions.login');
		res.cookie('x-auth-token', result.token, xAuthCookieOption);
		return res.status(201).json({ message: result.message });
	});

	loginRequest = catchAsyncErrors(async (req, res) => {
		const xAuthCookie = req.signedCookies['x-auth-token'];
		if (xAuthCookie) await preventCSRFAttack(xAuthCookie);
		const { mobile } = req.body;
		const result = await this.#AuthService.loginRequest(mobile);
		return res.status(200).json(result);
	});

	login = catchAsyncErrors(async (req, res) => {
		const xAuthCookie = req.signedCookies['x-auth-token'];
		if (xAuthCookie) await preventCSRFAttack(xAuthCookie);
		const data = req.body;
		const result = await this.#AuthService.login(data);
		const xAuthCookieOption = config.get('cookieOptions.login');
		res.cookie('x-auth-token', result.token, xAuthCookieOption);
		return res.status(200).json({ message: result.message });
	});
}

export default new AuthController();
