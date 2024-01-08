import config from 'config';
import AuthService from './auth.service.js';
import authErrorMessages from './messages/auth.errorMessages.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import AppError from '../../errorHandling/app.error.js';
import tokenVerifier from '../../../common/jwtToken/jwtToken.verifier.js';

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
		return res.status(201).json(result.message);
	});

	loginRequest = catchAsyncErrors(async (req, res) => {
		const { mobile } = req.body;
		const result = await this.#AuthService.loginRequest(mobile);
		return res.status(200).json(result);
	});

	login = catchAsyncErrors(async (req, res) => {
		const xAuthCookie = req.signedCookies['x-auth-token'];
		if (xAuthCookie) {
			const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
			const decodedData = await tokenVerifier(xAuthCookie, tokenSecretKey);
			if (decodedData)
				throw new AppError(authErrorMessages.CSRFAttack['message'], authErrorMessages.CSRFAttack['statusCode']);
		}
		const data = req.body;
		const result = await this.#AuthService.login(data);
		const xAuthCookieOption = config.get('cookieOptions.login');
		res.cookie('x-auth-token', result.token, xAuthCookieOption);
		return res.status(200).json({ message: result.message });
	});
}

export default new AuthController();
