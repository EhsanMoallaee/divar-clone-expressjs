import AuthService from './auth.service.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';

class AuthController {
	#AuthService;
	constructor() {
		this.#AuthService = AuthService;
	}

	register = catchAsyncErrors(async (req, res) => {
		const userData = req.body;
		const user = await this.#AuthService.register(userData);
		return res.json(user);
	});
}

export default new AuthController();
