import config from 'config';
import AuthService from './auth.service.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';

class AuthController {
	#AuthService;
	constructor() {
		this.#AuthService = AuthService;
	}

	registerationRequest = catchAsyncErrors(async (req, res) => {
		const userData = req.body;
		const user = await this.#AuthService.registerationRequest(userData);
		return res.json(user);
	});

	register = catchAsyncErrors(async (req, res) => {
		const data = req.body;
		const result = await this.#AuthService.register(data);
		const xAuthCookieOption = config.get('cookieOptions.login');
		res.cookie('x-auth-token', result.token, xAuthCookieOption);
		return res.status(201).json(result);
	});
}

export default new AuthController();
